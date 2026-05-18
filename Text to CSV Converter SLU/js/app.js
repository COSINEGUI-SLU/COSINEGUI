/**
 * Text to CSV Converter Application
 * 
 * This JavaScript file handles all the functionality for the Text to CSV Converter,
 * including file upload, parsing, conversion, normalization, and matching.
 */

// Global variables to store data
let uploadedTextContent = null;
let convertedData = null;
let experimentalData = null;
let predictedData = null;
let matchedData = null;

// Constants
const DEFAULT_TOLERANCE = 0.01;

/**
 * Initialize the application when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Set up drag and drop for the main converter
    setupDragAndDrop('dropZone', 'fileInput', handleFileUpload);
    
    // Set up drag and drop for experimental data
    setupDragAndDrop('expDropZone', 'expFileInput', handleExperimentalFileUpload);
    
    // Set up drag and drop for predicted data
    setupDragAndDrop('predDropZone', 'predFileInput', handlePredictedFileUpload);
    
    // Set up button event listeners
    document.getElementById('convertBtn').addEventListener('click', convertToCSV);
    document.getElementById('downloadBtn').addEventListener('click', downloadCSV);
    document.getElementById('matchBtn').addEventListener('click', matchData);
    document.getElementById('downloadMatchedBtn').addEventListener('click', downloadMatchedData);
    
    // Set up settings change listeners
    document.getElementById('delimiterSelect').addEventListener('change', function() {
        if (uploadedTextContent) {
            previewTextContent(uploadedTextContent);
        }
    });
    
    document.getElementById('normalizeCheck').addEventListener('change', function() {
        if (uploadedTextContent) {
            previewTextContent(uploadedTextContent);
        }
    });
    
    document.getElementById('headerCheck').addEventListener('change', function() {
        if (uploadedTextContent) {
            previewTextContent(uploadedTextContent);
        }
    });
});

/**
 * Set up drag and drop functionality for a specific zone
 * @param {string} dropZoneId - ID of the drop zone element
 * @param {string} fileInputId - ID of the file input element
 * @param {Function} handleFunction - Function to handle the file upload
 */
function setupDragAndDrop(dropZoneId, fileInputId, handleFunction) {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(fileInputId);
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    // Remove highlight when item is dragged away or dropped
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFunction(files[0]);
        }
    }, false);
    
    // Handle file input change
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFunction(this.files[0]);
        }
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropZone.classList.add('active');
    }
    
    function unhighlight() {
        dropZone.classList.remove('active');
    }
}

/**
 * Handle file upload for the main converter
 * @param {File} file - The uploaded file
 */
function handleFileUpload(file) {
    // Display file info
    const fileInfo = document.getElementById('fileInfo');
    fileInfo.innerHTML = `<strong>${file.name}</strong> (${formatFileSize(file.size)})`;
    
    // Enable convert button
    document.getElementById('convertBtn').disabled = false;
    
    // Read file content
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedTextContent = e.target.result;
        previewTextContent(uploadedTextContent);
    };
    reader.readAsText(file);
}

/**
 * Handle experimental file upload
 * @param {File} file - The uploaded file
 */
function handleExperimentalFileUpload(file) {
    // Display file info
    const fileInfo = document.getElementById('expFileInfo');
    fileInfo.innerHTML = `<strong>${file.name}</strong> (${formatFileSize(file.size)})`;
    
    // Read file content
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = e.target.result;
        parseExperimentalData(fileContent);
        
        // Enable match button if both files are uploaded
        checkEnableMatchButton();
    };
    reader.readAsText(file);
}

/**
 * Handle predicted file upload
 * @param {File} file - The uploaded file
 */
function handlePredictedFileUpload(file) {
    // Display file info
    const fileInfo = document.getElementById('predFileInfo');
    fileInfo.innerHTML = `<strong>${file.name}</strong> (${formatFileSize(file.size)})`;
    
    // Read file content
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = e.target.result;
        parsePredictedData(fileContent);
        
        // Enable match button if both files are uploaded
        checkEnableMatchButton();
    };
    reader.readAsText(file);
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Preview text content in the preview container
 * @param {string} content - Text content to preview
 */
function previewTextContent(content) {
    const previewContent = document.getElementById('previewContent');
    
    // Create a pre element for the preview
    const preElement = document.createElement('pre');
    preElement.className = 'border p-3 bg-light';
    
    // Limit preview to first 100 lines
    const lines = content.split('\n');
    const previewLines = lines.slice(0, 100);
    
    // Join lines and add ellipsis if truncated
    let previewText = previewLines.join('\n');
    if (lines.length > 100) {
        previewText += '\n...(truncated)';
    }
    
    preElement.textContent = previewText;
    
    // Clear previous content and add new preview
    previewContent.innerHTML = '';
    previewContent.appendChild(preElement);
}

/**
 * Convert uploaded text to CSV
 */
function convertToCSV() {
    if (!uploadedTextContent) {
        showAlert('No file uploaded', 'danger');
        return;
    }
    
    // Show spinner
    const spinner = document.getElementById('convertSpinner');
    spinner.classList.remove('hidden');
    
    // Get settings
    const delimiterOption = document.getElementById('delimiterSelect').value;
    const normalize = document.getElementById('normalizeCheck').checked;
    const hasHeader = document.getElementById('headerCheck').checked;
    
    // Use setTimeout to allow UI to update before processing
    setTimeout(() => {
        try {
            // Detect if this is predicted data format (with energy levels)
            const isPredictedFormat = isPredictedData(uploadedTextContent);
            
            if (isPredictedFormat) {
                convertedData = processPredictedFormat(uploadedTextContent);
            } else {
                convertedData = processExperimentalFormat(uploadedTextContent, delimiterOption, normalize, hasHeader);
            }
            
            // Display preview of converted data
            displayConvertedData(convertedData);
            
            // Show download button
            document.getElementById('downloadContainer').classList.remove('hidden');
            
            // Hide spinner
            spinner.classList.add('hidden');
            
            showAlert('Conversion successful!', 'success');
        } catch (error) {
            console.error('Conversion error:', error);
            showAlert('Error converting file: ' + error.message, 'danger');
            spinner.classList.add('hidden');
        }
    }, 100);
}

/**
 * Check if text content is in predicted data format
 * @param {string} content - Text content to check
 * @returns {boolean} True if content is in predicted format
 */
function isPredictedData(content) {
    // Check for energy level indicators
    return /^energy\d+/m.test(content) || content.includes('#PREDICTED BY CFM-ID');
}

/**
 * Process experimental data format
 * @param {string} content - Text content to process
 * @param {string} delimiterOption - Selected delimiter option
 * @param {boolean} normalize - Whether to normalize intensity values
 * @param {boolean} hasHeader - Whether the file has a header row
 * @returns {Object} Processed data object
 */
function processExperimentalFormat(content, delimiterOption, normalize, hasHeader) {
    // Determine delimiter
    let delimiter;
    if (delimiterOption === 'auto') {
        delimiter = detectDelimiter(content);
    } else {
        delimiter = getDelimiterChar(delimiterOption);
    }
    
    // Split content into lines
    const lines = content.split('\n');
    
    // Find where the data section starts (after metadata)
    let dataStartIndex = 0;
    let foundHeader = false;
    
    // Look for header line with m/z and intensity
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) continue;
        
        // Check if this line contains m/z and intensity headers
        if (line.toLowerCase().includes('m/z') || 
            line.toLowerCase().includes('mz') || 
            line.toLowerCase().includes('intensity')) {
            dataStartIndex = i + 1; // Data starts after this line
            foundHeader = true;
            break;
        }
        
        // If we find a line with two numeric values, assume data starts here
        const parts = line.split(delimiter).map(p => p.trim());
        if (parts.length >= 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
            dataStartIndex = i;
            break;
        }
    }
    
    // If we didn't find a header but user says there is one, use first non-empty line
    if (!foundHeader && hasHeader) {
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim()) {
                dataStartIndex = i + 1;
                foundHeader = true;
                break;
            }
        }
    }
    
    // Parse data rows
    const data = [];
    
    for (let i = dataStartIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) continue;
        
        // Split by delimiter
        const parts = line.split(delimiter).map(p => p.trim());
        
        // We need at least two parts (m/z and intensity)
        if (parts.length >= 2) {
            try {
                const mz = parseFloat(parts[0]);
                const intensity = parseFloat(parts[1]);
                
                // Only add if both values are valid numbers
                if (!isNaN(mz) && !isNaN(intensity)) {
                    data.push({
                        mz: mz,
                        intensity: intensity
                    });
                }
            } catch (e) {
                console.warn('Error parsing line:', line, e);
            }
        }
    }
    
    // Normalize intensity values if requested
    if (normalize && data.length > 0) {
        const maxIntensity = Math.max(...data.map(row => row.intensity));
        if (maxIntensity > 0) {
            data.forEach(row => {
                row.intensity = (row.intensity / maxIntensity) * 100;
            });
        }
    }
    
    return {
        data: data,
        headers: ['mz', 'intensity'],
        format: 'experimental'
    };
}

/**
 * Process predicted data format
 * @param {string} content - Text content to process
 * @returns {Object} Processed data object
 */
function processPredictedFormat(content) {
    // Split content into lines
    const lines = content.split('\n');
    
    // Parse data
    const data = [];
    let currentEnergy = "0";
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines and comment lines
        if (!line || line.startsWith('#')) continue;
        
        // Check if this is an energy level indicator
        if (line.startsWith('energy')) {
            currentEnergy = line.replace('energy', '');
            continue;
        }
        
        // Check if this is a data line with m/z and intensity
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
            try {
                // Try to convert first two parts to float (m/z and intensity)
                const mz = parseFloat(parts[0]);
                const intensity = parseFloat(parts[1]);
                
                // Skip lines that don't have valid numeric values
                if (!isNaN(mz) && !isNaN(intensity)) {
                    const row = {
                        mz: mz,
                        intensity: intensity,
                        CE: currentEnergy
                    };
                    
                    data.push(row);
                }
            } catch (e) {
                console.warn('Error parsing line:', line, e);
            }
        }
    }
    
    return {
        data: data,
        headers: ['mz', 'intensity', 'CE'],
        format: 'predicted'
    };
}

/**
 * Detect delimiter in text content
 * @param {string} content - Text content to analyze
 * @returns {string} Detected delimiter
 */
function detectDelimiter(content) {
    // Get first few non-comment lines
    const lines = content.split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('#'))
        .slice(0, 10);
    
    if (lines.length === 0) {
        return ' '; // Default to space
    }
    
    // Count occurrences of potential delimiters
    const delimiters = {
        '\t': 0,
        ',': 0,
        ' ': 0,
        ';': 0
    };
    
    // Check for tab delimiter first (common in experimental data)
    if (content.includes('\t')) {
        return '\t';
    }
    
    lines.forEach(line => {
        for (const delimiter in delimiters) {
            delimiters[delimiter] += (line.match(new RegExp(delimiter === ' ' ? '\\s+' : delimiter, 'g')) || []).length;
        }
    });
    
    // Find the delimiter with the most consistent count across lines
    let bestDelimiter = ' ';
    let bestScore = 0;
    
    for (const delimiter in delimiters) {
        const count = delimiters[delimiter];
        if (count > bestScore) {
            bestScore = count;
            bestDelimiter = delimiter;
        }
    }
    
    return bestDelimiter;
}

/**
 * Get delimiter character from option
 * @param {string} option - Delimiter option
 * @returns {string} Delimiter character
 */
function getDelimiterChar(option) {
    switch (option) {
        case 'tab': return '\t';
        case 'comma': return ',';
        case 'semicolon': return ';';
        case 'space':
        default:
            return ' ';
    }
}

/**
 * Display converted data in the preview container
 * @param {Object} data - Converted data object
 */
function displayConvertedData(data) {
    const previewContent = document.getElementById('previewContent');
    
    // Create table for preview
    const table = document.createElement('table');
    table.className = 'table table-striped table-sm';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    data.headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Limit to first 100 rows for preview
    const previewData = data.data.slice(0, 100);
    
    previewData.forEach(row => {
        const tr = document.createElement('tr');
        
        data.headers.forEach(header => {
            const td = document.createElement('td');
            
            // Format numeric values
            if (typeof row[header] === 'number') {
                td.textContent = row[header].toFixed(header === 'mz' ? 6 : 2);
            } else {
                td.textContent = row[header] || '';
            }
            
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    
    // Add row count information
    const infoDiv = document.createElement('div');
    infoDiv.className = 'mt-2 text-muted';
    
    if (data.data.length > 100) {
        infoDiv.textContent = `Showing 100 of ${data.data.length} rows`;
    } else {
        infoDiv.textContent = `${data.data.length} rows total`;
    }
    
    // Clear previous content and add new preview
    previewContent.innerHTML = '';
    previewContent.appendChild(table);
    previewContent.appendChild(infoDiv);
}

/**
 * Download converted data as CSV
 */
function downloadCSV() {
    if (!convertedData || !convertedData.data || convertedData.data.length === 0) {
        showAlert('No data to download', 'danger');
        return;
    }
    
    try {
        // Convert data to CSV
        const csv = Papa.unparse({
            fields: convertedData.headers,
            data: convertedData.data.map(row => 
                convertedData.headers.map(header => row[header])
            )
        });
        
        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'converted_data.csv');
        
        showAlert('Download started', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showAlert('Error downloading file: ' + error.message, 'danger');
    }
}

/**
 * Parse experimental data for matching
 * @param {string} content - Text content to parse
 */
function parseExperimentalData(content) {
    try {
        // Detect if this is predicted data format (with energy levels)
        const isPredictedFormat = isPredictedData(content);
        
        if (isPredictedFormat) {
            experimentalData = processPredictedFormat(content);
        } else {
            experimentalData = processExperimentalFormat(content, 'auto', true, false);
        }
        
        showAlert('Experimental data loaded successfully', 'success');
    } catch (error) {
        console.error('Parsing error:', error);
        showAlert('Error parsing experimental data: ' + error.message, 'danger');
        experimentalData = null;
    }
}

/**
 * Parse predicted data for matching
 * @param {string} content - Text content to parse
 */
function parsePredictedData(content) {
    try {
        // Detect if this is predicted data format (with energy levels)
        const isPredictedFormat = isPredictedData(content);
        
        if (isPredictedFormat) {
            predictedData = processPredictedFormat(content);
        } else {
            predictedData = processExperimentalFormat(content, 'auto', true, false);
        }
        
        showAlert('Predicted data loaded successfully', 'success');
    } catch (error) {
        console.error('Parsing error:', error);
        showAlert('Error parsing predicted data: ' + error.message, 'danger');
        predictedData = null;
    }
}

/**
 * Check if match button should be enabled
 */
function checkEnableMatchButton() {
    const matchBtn = document.getElementById('matchBtn');
    matchBtn.disabled = !(experimentalData && predictedData);
}

/**
 * Match experimental and predicted data
 */
function matchData() {
    if (!experimentalData || !predictedData) {
        showAlert('Both experimental and predicted data are required', 'danger');
        return;
    }
    
    // Show spinner
    const spinner = document.getElementById('matchSpinner');
    spinner.classList.remove('hidden');
    
    // Get tolerance value
    const tolerance = parseFloat(document.getElementById('toleranceInput').value) || DEFAULT_TOLERANCE;
    
    // Use setTimeout to allow UI to update before processing
    setTimeout(() => {
        try {
            // Match data
            matchedData = matchDatasets(experimentalData.data, predictedData.data, tolerance);
            
            // Display match results
            displayMatchResults(matchedData);
            
            // Show download button
            document.getElementById('matchDownloadContainer').classList.remove('hidden');
            
            // Hide spinner
            spinner.classList.add('hidden');
            
            showAlert('Data matching completed successfully', 'success');
        } catch (error) {
            console.error('Matching error:', error);
            showAlert('Error matching data: ' + error.message, 'danger');
            spinner.classList.add('hidden');
        }
    }, 100);
}

/**
 * Match experimental and predicted datasets
 * @param {Array} experimentalData - Experimental data array
 * @param {Array} predictedData - Predicted data array
 * @param {number} tolerance - m/z tolerance
 * @returns {Object} Matched data object
 */
function matchDatasets(experimentalData, predictedData, tolerance) {
    const matchedExp = [];
    const matchedPred = [];
    
    // For each experimental data point
    for (const expRow of experimentalData) {
        // Find matching predicted data points within tolerance
        const matches = predictedData.filter(predRow => {
            const mzDiff = Math.abs(predRow.mz - expRow.mz);
            return mzDiff <= tolerance;
        });
        
        // If matches found, use the closest one
        if (matches.length > 0) {
            // Sort by m/z difference
            matches.sort((a, b) => 
                Math.abs(a.mz - expRow.mz) - Math.abs(b.mz - expRow.mz)
            );
            
            // Add to matched arrays
            matchedExp.push(expRow);
            matchedPred.push(matches[0]);
        }
    }
    
    return {
        experimental: matchedExp,
        predicted: matchedPred,
        count: matchedExp.length
    };
}

/**
 * Display match results
 * @param {Object} matchData - Match data object
 */
function displayMatchResults(matchData) {
    const matchResults = document.getElementById('matchResults');
    
    // Create result summary
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'alert alert-info';
    summaryDiv.innerHTML = `
        <h4>Match Summary</h4>
        <p>Found ${matchData.count} matches between experimental and predicted data.</p>
    `;
    
    // Create table for matched data preview
    const table = document.createElement('table');
    table.className = 'table table-striped table-sm';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add headers
    ['m/z (Exp)', 'Intensity (Exp)', 'm/z (Pred)', 'Intensity (Pred)', 'Diff (m/z)'].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Limit to first 50 matches for preview
    const previewCount = Math.min(50, matchData.count);
    
    for (let i = 0; i < previewCount; i++) {
        const expRow = matchData.experimental[i];
        const predRow = matchData.predicted[i];
        const mzDiff = Math.abs(predRow.mz - expRow.mz);
        
        const tr = document.createElement('tr');
        
        // Add cells
        [
            expRow.mz.toFixed(6),
            expRow.intensity.toFixed(2),
            predRow.mz.toFixed(6),
            predRow.intensity.toFixed(2),
            mzDiff.toFixed(6)
        ].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    }
    
    table.appendChild(tbody);
    
    // Add row count information
    const infoDiv = document.createElement('div');
    infoDiv.className = 'mt-2 text-muted';
    
    if (matchData.count > 50) {
        infoDiv.textContent = `Showing 50 of ${matchData.count} matches`;
    } else {
        infoDiv.textContent = `${matchData.count} matches total`;
    }
    
    // Clear previous content and add new results
    matchResults.innerHTML = '';
    matchResults.appendChild(summaryDiv);
    matchResults.appendChild(table);
    matchResults.appendChild(infoDiv);
}

/**
 * Download matched data as CSV
 */
function downloadMatchedData() {
    if (!matchedData || matchedData.count === 0) {
        showAlert('No matched data to download', 'danger');
        return;
    }
    
    try {
        // Create combined data with both experimental and predicted values
        const combinedData = [];
        
        for (let i = 0; i < matchedData.count; i++) {
            const expRow = matchedData.experimental[i];
            const predRow = matchedData.predicted[i];
            
            const combinedRow = {
                'mz_exp': expRow.mz,
                'intensity_exp': expRow.intensity,
                'mz_pred': predRow.mz,
                'intensity_pred': predRow.intensity,
                'mz_diff': Math.abs(predRow.mz - expRow.mz)
            };
            
            // Add any additional columns
            for (const key in expRow) {
                if (key !== 'mz' && key !== 'intensity') {
                    combinedRow[`${key}_exp`] = expRow[key];
                }
            }
            
            for (const key in predRow) {
                if (key !== 'mz' && key !== 'intensity') {
                    combinedRow[`${key}_pred`] = predRow[key];
                }
            }
            
            combinedData.push(combinedRow);
        }
        
        // Convert data to CSV
        const csv = Papa.unparse({
            data: combinedData
        });
        
        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'matched_data.csv');
        
        showAlert('Download started', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showAlert('Error downloading file: ' + error.message, 'danger');
    }
}

/**
 * Show alert message
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, danger, etc.)
 */
function showAlert(message, type) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}
