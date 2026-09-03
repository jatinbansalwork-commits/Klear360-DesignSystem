const handleError = ({
  toolName,
  errorObject,
  mcpErrorMessage = '',
}: {
  toolName: string;
  errorObject?: unknown;
  mcpErrorMessage?: string;
}): {
  isError: true;
  content: Array<{ type: 'text'; text: string }>;
} => {
  return {
    isError: true,
    content: [
      {
        type: 'text',
        text: errorObject
          ? `Error in ${toolName}: ${
              errorObject instanceof Error ? errorObject.message : String(errorObject)
            }`
          : mcpErrorMessage,
      },
    ],
  };
};

export { handleError };
