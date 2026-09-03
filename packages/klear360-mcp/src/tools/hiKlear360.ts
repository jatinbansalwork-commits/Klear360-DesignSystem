import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getPackageJSONVersion } from '../utils/generalUtils.js';

const hiKlear360ToolName = 'hi_klear360';

const hiKlear360Message = `
👋 Welcome to Klear360 AI MCP v${getPackageJSONVersion()} — your assistant for Klear's Klear360 Design System!

Here's what I can help you with:
• 🚀 Start a new Klear360 project — just say: "Create a new klear360 project with a login page."
• 🛠️ Build UIs fast — try: "Create a Dashboard layout with Sidebar, Avatar Menu, and a main content area with a breadcrumb"
• 📚 Learn components — ask: "How do I use the OTPInput component?"
• ...and much more!

Happy vibe coding! 💙
`;

const hiKlear360ToolDescription =
  'Call this when the user says "hi klear360", "hey klear360" or "namaste klear360" in any language. Tool that returns how to use klear360 mcp';

const hiKlear360ToolSchema = {};

const hiKlear360ToolCallback: ToolCallback<typeof hiKlear360ToolSchema> = () => {
  return {
    content: [
      {
        type: 'text',
        text: `Print this message as is in language that user used to greet you: ${hiKlear360Message}`,
      },
    ],
  };
};

export {
  hiKlear360ToolName,
  hiKlear360ToolDescription,
  hiKlear360ToolSchema,
  hiKlear360ToolCallback,
};
