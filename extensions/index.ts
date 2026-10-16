import { realpathSync } from "node:fs";
import { join, relative } from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  const skillsDirectory = realpathSync(new URL("../skills/", import.meta.url));

  const selectSkill = (args: string, ctx: ExtensionContext) => {
    const report = (text: string, type: "info" | "warning" = "info") => {
      if (ctx.hasUI) ctx.ui.notify(text, type);
      else if (ctx.mode === "print") process.stderr.write(`${text}\n`);
      else pi.sendMessage({ customType: "coding-skills", content: text, display: true, details: undefined }, { triggerTurn: false });
    };
    const commands = pi.getCommands();
    const skills = commands.filter((command) => {
      if (command.source !== "skill" || !/^skill:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(command.name)) return false;
      if (commands.filter((other) => other.name === command.name).length !== 1) return false;
      try {
        return relative(skillsDirectory, realpathSync(command.sourceInfo.path)) === join(command.name.slice(6), "SKILL.md");
      } catch {
        return false;
      }
    }).sort((a, b) => a.name.localeCompare(b.name));

    const selection = /^\s*(\S+)(?:\s([\s\S]*))?$/.exec(args);
    if (!selection) {
      report([
        "/coding <skill> [arguments] — or use /skill:<skill> directly.",
        ...skills.map((skill) => `${skill.name.slice(6)} — ${skill.description ?? ""}`),
        ...(skills.length ? [] : ["No Coding Skills are loaded. Check the package's skill filters in pi config."]),
      ].join("\n"));
      return;
    }
    const skill = skills.find((command) => command.name === `skill:${selection[1]}`);
    if (!skill) {
      report("Skill unavailable. Use /coding to list loaded Coding Skills; disabled or conflicting resources cannot be launched.", "warning");
      return;
    }
    if (!ctx.isIdle()) {
      report("Agent is busy. Wait for the current run to finish before starting another skill.", "warning");
      return;
    }
    return `/${skill.name}${selection[2] === undefined ? "" : ` ${selection[2]}`}`;
  };

  pi.on("session_start", (_event, ctx) => {
    if (ctx.mode !== "tui" && ctx.mode !== "rpc") return;
    pi.registerCommand("coding", {
      description: "List Coding Skills or run /coding <skill> [arguments]",
      handler: async (args, context) => {
        const prompt = selectSkill(args, context);
        if (prompt) pi.sendUserMessage(prompt, { expandPromptTemplates: true });
      },
    });
  });
  // CLI input transforms stay in the host's awaited prompt instead of forking a turn.
  pi.on("input", (event, ctx) => {
    if (ctx.mode === "tui" || ctx.mode === "rpc" || event.source === "extension") return { action: "continue" };
    const command = /^\/coding(?:\s([\s\S]*))?$/.exec(event.text);
    if (!command) return { action: "continue" };
    const text = selectSkill(command[1] ?? "", ctx);
    return text ? { action: "transform", text } : { action: "handled" };
  });
}
