# Text to CSV Converter - Deployment Guide

This guide provides instructions for deploying the static Text to CSV Converter web application.

## Application Overview

The Text to CSV Converter is a pure JavaScript web application that allows users to:
- Upload text files and convert them to CSV format
- Process both experimental and predicted mass spectrometry data
- Normalize intensity values to a maximum of 100
- Match experimental and predicted datasets based on m/z values
- Download the converted data as CSV files

## Deployment Options

Since this is a static web application (HTML, CSS, and JavaScript only), it can be deployed to any web hosting service that supports static files. Here are some popular options:

### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Upload the contents of the zip file to the repository
3. Enable GitHub Pages in the repository settings
4. Your site will be available at `https://yourusername.github.io/repositoryname/`

### Option 2: Netlify (Free)
1. Sign up for a Netlify account
2. Drag and drop the folder containing the extracted files to the Netlify dashboard
3. Your site will be deployed automatically with a random URL
4. You can set up a custom domain if desired

### Option 3: Vercel (Free)
1. Sign up for a Vercel account
2. Install the Vercel CLI: `npm i -g vercel`
3. Navigate to the folder containing the extracted files
4. Run `vercel` and follow the prompts
5. Your site will be deployed with a Vercel URL

### Option 4: Any Web Hosting Service
1. Extract the zip file
2. Upload the contents to your web hosting service via FTP or their control panel
3. Access the site via your domain name

## Local Testing

To test the application locally before deployment:
1. Extract the zip file to a folder on your computer
2. Open the `index.html` file in a web browser
3. The application should work fully without any server requirements

## File Structure

- `index.html` - The main HTML file
- `js/app.js` - The JavaScript code that powers the application
- `test_data/` - Sample files for testing the application

## Browser Compatibility

The application is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Support

If you encounter any issues with the application, please try:
1. Using a different browser
2. Clearing your browser cache
3. Checking if your file format matches the expected format

For further assistance, please contact the developer.
