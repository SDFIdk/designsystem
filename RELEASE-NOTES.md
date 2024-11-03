# Designsystem release notes (from v7 up)

## v8.0.0

Designsystem no longer uses SASS/scss for building style sheets (CSS). All styles are ported to vanilla CSS.
Building from `index.scss` is not possible. You should import or build from `index.css` instead.

You can stil use `assets/designsystem.css` as before.

## v7.0.0

New features include:

* Upgraded icons, logs, typography, and colors.
* New convenience web components for adding logos: `DSLogoTitle` and `DSLogo`

### Changes

When upgrading to v7.x, you should consider the following changes.

#### New logo

* There are new logo icons to replace the old ones.

#### Icons

* File `designsystem-icons.svg` has changed to just `icons.svg`
* Some icons have changed ids when importing via `<svg><use>`
* All icons have changed to shorter file names. Look up `assets/icons/` for the new file names.

#### Some utility classes deprecated

* Some utility classes like `.ds-padding` and `.ds-margin` have to deprecated in favour of `.ds-p` and `.ds-m`

#### Grid system changes

* Grid system classes are still available, but there are some changes to paddings and margins. [Check the examples ](./docs/examples/grid.html) to see how they should be used.