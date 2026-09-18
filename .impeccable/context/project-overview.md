## Design References

The `screens/` folder contains the approved Stitch-generated UI screens.

The `images/` folder contains the approved visual assets used by the screens.

These folders are the primary visual references for implementation.

### Screen Reference Rules

Before implementing a screen:

1. Inspect the corresponding image in `screens/`.
2. Identify layout structure.
3. Identify typography hierarchy.
4. Identify spacing.
5. Identify colors.
6. Identify component dimensions.
7. Identify visual states.
8. Reuse assets from `images/` where applicable.

Do not create a visually different interpretation when an approved screen already exists.

### Asset Rules

Use assets from the `images/` folder whenever an appropriate asset exists.

Do not replace an existing project asset with:
- Random web images
- Placeholder images
- Emoji
- Generated SVGs
- Generic stock graphics

unless the asset is explicitly intended to be generated dynamically.

### Responsive Screens

If both desktop and mobile references exist, treat both as approved designs.

Do not simply scale the desktop screen to create mobile.

The mobile reference should determine the mobile composition.