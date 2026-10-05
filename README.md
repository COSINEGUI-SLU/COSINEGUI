# COSine v1.7.3

COSine is a Java desktop application for transparent pairwise comparison of experimental and predicted or reference MS/MS spectra. It preserves source m/z precision, performs deterministic one-to-one peak matching, reports complementary cosine scores, and creates mirror plots from the exact peaks used in scoring.

Developed by Javad Mottaghipisheh and Rajneesh Kumar Gautam at the Swedish University of Agricultural Sciences.

## Features

- Correct binary cosine: `M / sqrt(Nexp * Npred)`.
- Mutually exclusive absolute (Da) and relative (ppm) tolerance modes; no hidden fallback tolerance.
- Standard, square-root, generalized weighted, binary, and reverse cosine reported separately.
- Generalized weighted cosine uses `w = (m/z)^a * intensity^b`; defaults are `a = 3.0` and `b = 0.6`. It is an advanced alternative metric and is not constrained to be lower than standard cosine.
- One-to-one matching is deterministic: smallest absolute mass error, then higher predicted intensity, then lower m/z.
- CFM-ID collision-energy blocks can be scored separately, pooled using the maximum raw intensity at each exact m/z, or pooled after per-level normalization. Maximum-raw-intensity pooling is the default.
- Preprocessing is explicit: m/z range, base-peak normalization, minimum relative intensity, exact-duplicate collapse, and maximum peak count.
- Source m/z values are not rounded before matching or scoring.
- A visible warning identifies rounded input whose precision is too coarse for the selected absolute-Da tolerance.
- When matching source TXT files are present beside rounded CSV files, the app offers to switch to them automatically before calculation.
- Decimal tolerance boundaries are inclusive despite floating-point representation (for example, 102.04 versus 102.03 matches at 0.0100 Da).
- The mirror window shows the running app version and includes a Reset Zoom / Show All Peaks button.
- The COSine interface includes the established layout and naming style, dark-mode control, support button, and startup acknowledgement.
- Each run is displayed in an aligned score-summary table, with matched-peak details in a separate table.
- Mirror plots use constant-width stems: matched peaks are green and unmatched peaks are red. Stem width carries no analytical meaning.
- Qualitative High/Moderate/Low labels were removed. Scores are descriptive and are not standalone compound-identification thresholds.

## Requirements

- Java 17 or later
- The release JAR is self-contained and includes the plotting dependencies.

## Run

Extract the entire ZIP and double-click `COSine-v1.7.3.exe`. The complete folder must remain together because the launcher uses the included application JAR and Java runtime. A separate Java installation is not required. `Run-COSine-v1.7.3.bat` is retained as a fallback launcher.

The application accepts experimental CSV or plain-text peak lists and predicted CSV or CFM-ID text output. Experimental input requires m/z and intensity columns. Predicted CSV may include a third collision-energy column; raw CFM-ID text can contain `energy0`, `energy1`, and `energy2` blocks.

## Recommended reporting

Record the software version, filenames, m/z range, tolerance mode and value, minimum relative intensity, maximum peak count, collision-energy option, and weighted-cosine exponents. Do not compare scores obtained with different preprocessing or collision-energy settings as if they were equivalent.

For high-resolution data, ppm mode is usually the appropriate primary choice because the absolute window scales with m/z. Use Da mode when a fixed absolute window is required by an acquisition method or library. Select one mode explicitly.

## Build on Windows

Run `build-windows.bat` from the project directory with a JDK 17 installation. It compiles the source, executes the calculation self-tests, creates a runnable JAR, and then calls `jpackage` to create a Windows installer. Building an `.exe` requires Windows and WiX Toolset support compatible with the installed JDK.

## Validation data

The reviewer-revision benchmark uses 23 experimental spectra and their corresponding CFM-ID predictions. Each experimental spectrum is compared with every same-polarity candidate, producing 23 true comparisons and 246 nonmatching comparisons. This is a retrospective closed-set benchmark, not a blind external validation.

## License

MIT License. See `LICENSE`.

## Contact

Rajneesh Kumar Gautam: rajneesh.gautam@slu.se
