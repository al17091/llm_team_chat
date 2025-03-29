# LLM Team Chat Application

## Overview

This project is a team chat application powered by multiple Large Language Models (LLMs). It allows users to interact with a team of AI agents, each driven by a different LLM, to discuss and resolve queries. The application is built using Next.js, React, and other modern web technologies.

## Features

-   **Multi-LLM Support**: Integrates with various LLMs such as GPT-4o, Gemini, Claude-3-Sonnet, and others.
-   **Team Chat**: Simulates a team discussion where each member is an AI agent powered by a different LLM.
-   **Role-Based Messages**: Distinguishes messages by role (user, manager, member) with corresponding icons and badges.
-   **Real-time Updates**: Uses React's state management and component rendering for a dynamic chat experience.
-   **Server Actions**: Leverages Next.js Server Actions for secure and efficient API calls.
-   **UI Components**: Utilizes modern UI libraries like Material UI and Lucide React for a clean and intuitive interface.

## Technologies Used

-   **Next.js**: React framework for building server-rendered and statically generated web applications.
-   **React**: JavaScript library for building user interfaces.
-   **TypeScript**: Superset of JavaScript that adds static typing.
-   **Framer Motion**: Motion library for React to create animations and transitions.
-   **Material UI**: UI framework for React.
-   **Lucide React**: Collection of beautiful icons for React.
-   **node-fetch**: For making HTTP requests to LLM APIs.
-   **dotenv**: For managing environment variables.

## Setup

### Prerequisites

-   Node.js (version 20 or higher)
-   npm or yarn
-   API keys for the LLMs you want to use (e.g., OpenAI, Gemini, Claude)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd multi_llm_chat
    cd chat_app
    ```

2.  Install dependencies:

    ```bash
    npm install # or yarn install
    ```

3.  Set up environment variables:

    -   Create a `.env.local` file in the root directory.
    -   Add your API keys and other configuration variables. Example:

        ```
        NEXT_PUBLIC_O1_API_KEY=your_o1_api_key
        NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
        NEXT_PUBLIC_SONNET_API_KEY=your_sonnet_api_key
        NEXT_PUBLIC_FOUR_API_KEY=your_4o_api_key
        ```

### Running the Application

```bash
npm run dev # or yarn dev
```

Open your browser and navigate to `http://localhost:3000` to view the application.

## Configuration

The application uses the following environment variables:

-   `NEXT_PUBLIC_O1_API_KEY`: API key for the O1 LLM.
-   `NEXT_PUBLIC_GEMINI_API_KEY`: API key for the Gemini LLM.
-   `NEXT_PUBLIC_SONNET_API_KEY`: API key for the Claude-3-Sonnet LLM.
-   `NEXT_PUBLIC_FOUR_API_KEY`: API key for the GPT-4o LLM.

You can modify the LLM configurations in `src/components/LLMTeamChatApp.tsx` to add or remove LLMs, and adjust their parameters (temperature, maxTokens, etc.).

## Directory Structure (chat_app)
```
chat_app/
├── .devcontainer/ # VS Code Dev Container configuration
├── src/
│ ├── components/ # React components
│ │ ├── LLMTeamChatApp.tsx # Main component
│ │ ├── ChatMessage.tsx # Chat message component
│ │ ├── Sidebar.tsx # Sidebar component
│ │ └── ...
│ ├── lib/ # Utility functions and API calls
│ │ ├── api.ts # API functions for fetching LLM responses
│ │ ├── actions.ts # Server Actions
│ │ ├── utils.ts # Utility functions
│ │ └── ...
│ ├── app/ # Next.js app directory
│ │ ├── page.tsx # Main page component
│ │ └── ...
│ └── styles/ # CSS styles
│ └── globals.css
├── public/ # Static assets
├── .env.local # Environment variables
├── next.config.js # Next.js configuration
├── package.json # Project dependencies
├── README.md # Documentation
└── tsconfig.json # TypeScript configuration
```

## VS Code Dev Container

This project includes a VS Code Dev Container configuration for a consistent development environment. The `.devcontainer` directory contains the `devcontainer.json` file, which defines the container's settings.

To use the Dev Container:

1.  Install the VS Code Remote - Containers extension.
2.  Open the project in VS Code.
3.  If prompted, click "Reopen in Container". Otherwise, use the command "Remote-Containers: Reopen in Container".

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

[MIT](LICENSE)