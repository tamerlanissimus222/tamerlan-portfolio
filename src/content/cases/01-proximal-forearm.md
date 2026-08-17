---
order: 1
title: "Proximal forearm socket"
eyebrow: "Case 01 / Socket geometry"
level: "Transverse deficiency"
context: "[CASE CONTEXT - TO BE ADDED]"
challenge: "[DESIGN CHALLENGE - TO BE ADDED]"
approach: "[DIGITAL APPROACH - TO BE ADDED]"
validation:
  status: "FIT VERIFIED"
  summary: "Successful fitting recorded. [SUPPORTING VALIDATION DETAIL - TO BE ADDED]"
tags:
  - Patient scan
  - Biomechanics
  - Fusion 360
  - Socket iteration
  - FDM
stages:
  - id: "scan"
    title: "Scanning"
    icon: "scan"
    media:
      - type: "carousel"
        role: "standard"
        aspect: "landscape"
        caption: "Clinical reference series"
        autoplayMs: 2000
        slides:
          - src: "media/case1-originals/scanning-reference-01.jpg"
            alt: "Anonymised comparison used as a clinical reference before scanning."
            caption: "Clinical reference"
          - src: "media/case1-originals/scanning-reference-02.jpg"
            alt: "Anonymised residual-limb geometry viewed from above."
            caption: "Residual-limb geometry"
          - src: "media/case1-originals/scanning-reference-03.jpg"
            alt: "Anonymised residual limb positioned during range-of-motion assessment."
            caption: "Range-of-motion reference"
      - type: "model3d"
        role: "standard"
        aspect: "square"
        embedUrl: "https://tamerlanissimus222.github.io/Case1/viewer.html"
        poster: "media/case1-originals/scan-preview.png"
        alt: "Preview of the anonymised residual-limb 3D scan."
        caption: "Processed patient scan"
      - type: "youtube"
        role: "standard"
        aspect: "wide"
        youtubeId: "5fOTYZr9qmY"
        poster: "media/case1-originals/modelling-process-preview.png"
        alt: "Video poster showing the digital socket modelling process."
        caption: "Modelling process"

  - id: "modelling"
    title: "Digital modelling"
    icon: "cad"
    media:
      - type: "model3d"
        role: "standard"
        aspect: "square"
        embedUrl: "https://tamerlanissimus222.github.io/Case1/viewerIS.html"
        poster: "media/case1-originals/inner-socket-preview.png"
        alt: "Preview of the inner socket 3D model."
        caption: "Inner socket"
      - type: "model3d"
        role: "standard"
        aspect: "square"
        embedUrl: "https://tamerlanissimus222.github.io/Case1/viewerOS.html"
        poster: "media/case1-originals/outer-socket-preview.png"
        alt: "Preview of the outer socket 3D model."
        caption: "Outer socket"
      - type: "model3d"
        role: "standard"
        aspect: "square"
        embedUrl: "https://tamerlanissimus222.github.io/Case1/viewerButer1.html"
        poster: "media/case1-originals/interface-study-preview.png"
        alt: "Preview of the scan-to-socket interface model."
        caption: "Interface study"

  - id: "manufacturing"
    title: "Additive manufacturing"
    icon: "printer"
    media:
      - type: "image"
        role: "standard"
        aspect: "portrait"
        src: "media/case1-originals/manufacturing-assembly.jpg"
        alt: "Manufactured black prosthetic socket with a light inner liner."
        caption: "Manufactured assembly"
      - type: "image"
        role: "standard"
        aspect: "portrait"
        src: "media/case1-originals/manufacturing-side.jpg"
        alt: "Side view of the manufactured socket and inner liner."
        caption: "Side geometry"
      - type: "image"
        role: "standard"
        aspect: "portrait"
        src: "media/case1-originals/manufacturing-rear.jpg"
        alt: "Rear view of the manufactured socket prototype."
        caption: "Rear geometry"

  - id: "fitting"
    title: "Fitting / validation"
    icon: "fit"
    validation: true
    media:
      - type: "youtube"
        role: "featured"
        aspect: "landscape"
        youtubeId: "Go_BdPuMweI"
        poster: "media/case1-originals/fitting-preview.png"
        alt: "Video poster showing the prosthesis fitting and range-of-motion check."
        caption: "Final fitting check"
---

All patient-facing media remains anonymised. Replace placeholder copy only with verified, consented case information.
