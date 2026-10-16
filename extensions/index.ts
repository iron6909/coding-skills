import { realpathSync } from "node:fs";
import { join, relative } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  const skillsDirectory = realpathSync(new URL("../skills/", import.meta.url));

  pi.registerCommand("coding", {
    description: "List Coding Skills or run /coding <skill> [arguments]",
    handler: async (args, ctx) => {
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
      pi.sendUserMessage(`/${skill.name}${selection[2] === undefined ? "" : ` ${selection[2]}`}`, { expandPromptTemplates: true });
    },
  });
}
