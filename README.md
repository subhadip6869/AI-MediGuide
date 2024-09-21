# AI-MediGuide

**AI-MediGuide** is an AI-powered medicine search platform designed to provide users with comprehensive information about medicines and active ingredients. The platform is accessible across various devices (laptop, mobile, tablet) with a responsive, user-friendly interface.

## Features
* **Medicine Search:** Enter the name of a medicine to retrieve detailed information, including:
    * Product form
    * Active ingredient(s)
    * Usage instructions
    * Side effects
    * Precautions
    * Rx/OTC status
* **Active Ingredient** Search: Search by active ingredient to obtain detailed information on its uses and associated medicines.

* **Multiple Search Capability:** Users can input multiple medicines or ingredients separated by commas, and AI-MediGuide will provide detailed information for all of them.

* **Auto-Correction:** AI-powered spell check automatically corrects misspelled medicine names to ensure accurate search results.

* **AI-Powered Backend:** AI processes search queries to generate structured, accurate responses, which are displayed in a clean, tabular format on the frontend.

* **Responsive Design:** AI-MediGuide is fully responsive, adapting seamlessly to different screen sizes on various devices.

## Technologies Used

* Frontend:

    * HTML/CSS for structure and design.
    * JavaScript for dynamic elements and interactivity.
    * Responsive design principles for seamless usage across devices.

* Backend:

    * Gemini AI to process user queries and generate structured results.
    * Node.js for backend services and API integration.

## Getting Started

Follow the steps below to set up the project locally:

### Prerequisites

* Node.js and npm (for backend and frontend development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/subhadip6869/AI-MediGuide.git
```

2. Navigate to the project directory:
```bash
cd AI-MediGuide
```

3. Install dependencies:
```bash
npm install
```

4. Set up your Gemini API key:
    * Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create an API key.
    * In the project root directory, create a `.env` file.
    * Paste the following into the `.env` file, replacing `<your_api_key>` with your actual API key:
    ```properties
    GEMINI_KEY="<your_api_key>"
    ```

5. Start the development server:
```bash
npm start
```

### Usage
Once set up, you can access the application at ```http://localhost:3000``` and begin searching for medicines and active ingredients.
