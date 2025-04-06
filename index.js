
document.addEventListener('DOMContentLoaded', function() {
    const commandInput = document.getElementById('command');
    const searchInput = document.getElementById('search');
    const noResults = document.getElementById('no-results');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const saveDevCheckbox = document.getElementById('save-dev');
    const globalCheckbox = document.getElementById('global');
    const exactCheckbox = document.getElementById('exact');
    
    const packages = new Set();
    let allPackageItems = [];
    
    // Initialize all package items
    function initPackageItems() {
        allPackageItems = Array.from(document.querySelectorAll('.package-item'));
    }
    
    // Update the command based on selected packages and options
    function updateCommand() {
        let command = 'npm install';
        
        if (globalCheckbox.checked) {
            command += ' -g';
        }
        
        if (saveDevCheckbox.checked && !globalCheckbox.checked) {
            command += ' --save-dev';
        }
        
        if (exactCheckbox.checked) {
            command += ' --exact';
        }
        
        if (packages.size > 0) {
            command += ' ' + Array.from(packages).join(' ');
        }
        
        commandInput.value = command;
    }
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        let hasResults = false;
        
        allPackageItems.forEach(item => {
            const packageName = item.querySelector('.package-name').textContent.toLowerCase();
            if (packageName.includes(searchTerm)) {
                item.style.display = 'flex';
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        noResults.style.display = hasResults ? 'none' : 'block';
    });
    
    // Add package button click handler
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-btn')) {
            const pkg = e.target.getAttribute('data-pkg');
            
            if (packages.has(pkg)) {
                packages.delete(pkg);
                e.target.classList.remove('added');
                e.target.textContent = 'Add';
            } else {
                packages.add(pkg);
                e.target.classList.add('added');
                e.target.textContent = 'Added';
            }
            
            updateCommand();
        }
    });
    
    // Copy command button
    copyBtn.addEventListener('click', function() {
        commandInput.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
    
    // Clear all button
    clearBtn.addEventListener('click', function() {
        packages.clear();
        updateCommand();
        
        // Reset all add buttons
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.classList.remove('added');
            btn.textContent = 'Add';
        });
    });
    
    // Option checkboxes
    saveDevCheckbox.addEventListener('change', updateCommand);
    globalCheckbox.addEventListener('change', function() {
        if (this.checked) {
            saveDevCheckbox.checked = false;
        }
        updateCommand();
    });
    exactCheckbox.addEventListener('change', updateCommand);
    
    // Initialize
    initPackageItems();
    updateCommand();
});
