# Project gallery images

Put each project's images in `src/assets/project-images/`, in a subfolder named
for its project slug:

```text
src/assets/project-images/
  intelligent-blood-cell-classification-through-computer-vision-and-deep-learning/
    original-image-name.png
```

Then add the image and its caption to `captions.ts` under that project's slug.
Use short, URL-safe filenames (for example, `dashboard.png` or `results.png`).
The full display caption belongs in `captions.ts`, so it does not need to be in
the filename.