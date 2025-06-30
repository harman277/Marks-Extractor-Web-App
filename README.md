## 🔄 Web App Workflow (How It Works)

1. The user enters a URL like:  
   `https://ssc.digialm.com/per/g27/pub/...`  
   to fetch and extract candidate result data.

2. If the user clicks the search icon without entering a URL, an alert appears:  
   **"Please enter a URL."**

3. If the entered URL is invalid or the data can't be fetched, an error message is shown:  
   **"Unable to fetch. Please enter a valid URL."**

4. If the URL is valid, the candidate's data is extracted and displayed in a clean, tabular format.

5. The user can sort the candidate's marks table by criteria such as:
   - **Marks**
   - **Attempt**
   - **Not Attempted**
   - **Right**
   - **Wrong**

6. The extracted data can also be exported as a `.csv` file using the **"Export to CSV"** button.

7. The frontend of this web app is built using:
   - **HTML**, **CSS**, **JavaScript**
   - **Bootstrap 5.3** for a fully responsive design across all screen sizes

8. The backend is built using:
   - **Node.js**
   - **Cheerio** (for HTML parsing and web scraping)

---

## 🧩 Approach

This section outlines the core logic and flow of how the **Extractor Web App** processes and displays data from a provided URL.

1. **User Input:**  
   The user enters a valid SSC result URL into the input field on the homepage.

2. **Validation:**  
   If the input is empty, an alert prompts the user to enter a valid URL.

3. **Fetch Request:**  
   A POST request is sent to the backend with the URL.

4. **Scraping Logic (Backend):**  
   The backend, built on **Node.js**, uses the **Cheerio** module to scrape and parse HTML content from the given SSC result page.

5. **Display Data (Frontend):**  
   The frontend receives parsed data and renders it:
   - Candidate personal details
   - Subject-wise marks, attempts, etc.
   - Data is sorted and shown in responsive layouts depending on screen size.

6. **CSV Export:**  
   The user can export all subject marks and overall data to a `.csv` file with a single click.

7. **Responsive UI:**  
   Built with **Bootstrap 5.3**, the interface adapts seamlessly to mobile and desktop screens.

---

> 💡 **Technologies Used:**  
> - Node.js  
> - Express.js  
> - Cheerio  
> - Bootstrap 5.3  
> - HTML, CSS, JavaScript

🌐 Hosting Information
✅ The website is fully hosted on Vercel: 
https://marks-extractor-web-3zirs8e3g-harmans-projects-5a44066f.vercel.app/

⚠️ However, Vercel's free plan has a 10-second execution timeout for backend/serverless functions. Since Cheerio-based scraping can take 10–30 seconds, the backend may not work properly on Vercel. This means candidate data may fail to load or timeout on the hosted version.


🖥️ How to Run the Project Locally
To run the project on your own machine (where there are no timeout limits), follow these steps:

Download or clone the project from GitHub.

Open a terminal inside the project folder and run:

npm install
This will install all required dependencies.

Start the development server:

npm run dev
Open your browser and visit:

http://localhost:5000
