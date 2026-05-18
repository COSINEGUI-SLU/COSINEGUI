# COSine v1.6 – MS/MS Spectral Cosine Similarity Tool

**Developed by:** Javad & Rajneesh  
**Institution:** Swedish University of Agricultural Sciences, Sweden  
**Tool Description:**  
COSine is a Java-based graphical application designed to compute standard and weighted cosine similarity between experimental and predicted MS/MS spectra. It is tailored for mass spectrometry research workflows, with a focus on peak matching accuracy, intensity-based scoring, and usability.

---

## 🚀 What's New in v1.6

### 🔬 Scientific Improvements
- ✅ Tolerance slider now directly affects peak matching
- ✅ Mass range filtering (`min m/z`, `max m/z`) for both datasets
- ✅ Weighted cosine score updated to emphasize high-intensity peaks using **squared intensity weighting**
- ✅ Score interpretation labels (Best / Moderate / Low Match)

### 📊 Visualization & Plot Enhancements
- 🪞 Mirror plot with clean tooltip formatting and proper Y-axis label
- 💾 PNG saving with auto-extension `.png` if user omits it

### 🧠 Usability Upgrades
- 🧠 `String.format()` standardizes decimal output
- 🌙 Dark mode with seamless UI refresh
- 📁 File dialog remembers last-used folder

---

## 🧪 Resulting Features
- ⚖ Accurate cosine similarity scoring
- 🎯 Intensity-aware weighted scoring
- 📏 Tolerance + mass range control
- 🧠 Score threshold interpretation
- 💡 Smooth, intuitive GUI
- 🪞 Scientific mirror plotting for visual analysis

---

## 📥 Installation

> Requires Java 11 or higher.  
Run using:

```bash
java -jar COSine_v1.6.jar
```

---

## 📖 License

This software is provided under the **MIT License**. See `LICENSE` file for details.

---

## 🧾 Citation

If you use COSine in a publication, please cite as:

> Rajneesh & Javad (2025). COSine: A GUI Tool for Cosine Similarity-Based Spectral Comparison of MS/MS Data. Swedish University of Agricultural Sciences, Sweden.

---

## 🧑‍💻 Contact

- 📧 rajneesh@example.edu  
- 💬 Issues or suggestions? Open one on GitHub!
