/**
 * @param {Object} params
 * @param {string} params.toolName
 * @param {unknown} [params.errorObject]
 * @param {string} [params.mcpErrorMessage]
 * @returns {{isError: true, content: Array<{type: 'text', text: string}>}}
 */
const handleError = ({ toolName, errorObject, mcpErrorMessage = '' }) => {
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
