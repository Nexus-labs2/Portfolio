# 📁 Portfolio Folder Guide

## Structure
```
portfolio/
├── index.html                  ← Open this in your browser
├── HOW_TO_USE.md               ← This file
├── data/
│   └── portfolio.json          ← Edit your info, projects & certs here
├── assets/
│   ├── css/style.css
│   └── js/app.js
└── images/
    ├── projects/
    │   ├── major/
    │   │   ├── proj1/          ← Drop proj1 images here (any name, .jpg/.png/.webp)
    │   │   ├── proj2/
    │   │   ├── proj3/
    │   │   ├── proj4/
    │   │   ├── proj5/          ← Under development projects
    │   │   └── proj6/
    │   └── minor/              ← Drop minor project images here
    └── certifications/
        ├── matters/            ← Drop "Ones That Matter" cert images/PDFs here
        └── curiosity/          ← Drop "Out of Curiosity" cert images/PDFs here
```

## How to Add Your Content

### Projects
1. Open `data/portfolio.json`
2. Find the project you want to update
3. Edit the text fields
4. Drop images into the matching `images/projects/major/projN/` folder
5. Update the `"images"` array with your filenames

### Certificates
1. Drop the certificate image (JPG/PNG) or PDF screenshot into:
   - `images/certifications/matters/` for important ones
   - `images/certifications/curiosity/` for fun ones
2. Update `data/portfolio.json` → `certifications` section with the filename

### Run Locally
Just open `index.html` in any browser. No server needed.
