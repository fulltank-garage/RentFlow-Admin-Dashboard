import { requestAdmin } from "../core/api-client.service";
import type { PlatformAiAssistant } from "./ai.types";

export const aiService = {
  getAssistant() {
    return requestAdmin<PlatformAiAssistant>("/platform/ai/assistant");
  },
};
