This is my entry for the [10k Apart 2016 contest](http://a-k-apart.com/).  The challenge is basically to build a progressively enhanced, performant, accessible, and compelling web site in 10kb first load.  My entry is an implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), sort of a very simple simulation of the life of cells.  I decided to enter to experiment with some ideas and have fun inside these constraints and outside of the modes of my normal projects.  A demo deployment is at <https://10kgol.macn.me/>.

Some of the project highlights:

Performance
-----------

### Transfer

This project is 6.7kb first load, gzipped by Azure with the default game board, before lazy-loading.  With lazy-loading, it is only a bit above the 10k limit.  On subsequent loads, the HTML drops to 3.8kb.  Note that the project can easily go above the 10kb limit by setting the game board to be larger, around 1746 cells on the Azure instance.

- **gzip compression**: Rendering all of the cells as HTML is verbose, but repetitive, and gzip is somewhat friendly to this, though not as friendly as one might think.  It helps to a lesser extent with the CSS and JS too.  Gzip is required to get this project down below 10k.  Apache's 'mod_deflate' is more friendly to this project than Azure's.
- **inline + lazy first load assets**: I inline the entire CSS file on first load for fast render.  I lazy load CSS using a fake media attribute, either after a delay with JS or at the bottom of the document in a `<noscript>` element.  A server-sent cookie switches from inline to a regular `<link>` in the head on subsequent loads, so even lynx doesn't get the extra weight after the first load.  There is always a minimal amount of JS inlined.  On the first load, the CSS loader is included.  The JS loader is always included, with a mustard cut so old browsers don't load the main JS at all.
- **minification**: I minimize JS with [uglify js](https://github.com/mishoo/UglifyJS2) and the CSS with [cssnano](http://cssnano.co/) and [css-mqpacker](https://www.npmjs.com/package/css-mqpacker).
- **images**: I was going to use SVG icons, but they were a bit heavier than I liked.  I decided to take the challenge of making icons purely with CSS, using CSS shapes and generated content.  They aren't perfect, but work back to IE 8.
- **fonts**: `@font-face` fonts can be heavy.  I just went with a stack that I liked that won't require downloads.

#### On Azure

|     Load   |  HTML  |       JS        |     CSS      |
|------------|--------|-----------------|--------------|
| First      | 6.7kb  |  3.0kb (lazy)   | 3.2kb (lazy) |
| Subsequent | 3.8kb  | " (lazy+cached) |  " (cached)  |

#### On Apache2

|     Load   |  HTML  |       JS        |     CSS      |
|------------|--------|-----------------|--------------|
| First      | 4.9kb  |  2.8kb (lazy)   | 2.8kb (lazy) |
| Subsequent | 2.4kb  | " (lazy+cached) |  " (cached)  |


### Animation

- **cell**: Having this many DOM elements is rough for animations.  I wanted to make the cells transition between states and the alive ones wiggle, but I couldn't get the performance reasonable.  I threw in a few hover animations to try to make up for it.
- **ticks / play**: The functionality of incrementing ticks only has minor DOM manipulation to do per cell, but across all of the cells can be slow on phones or older browsers / devices.  It is still reasonably fast to be usable though on devices I tested.  If 'play' runs too fast, it is possible for cell switches or ticks to be skipped, so I attempted to mitigate this by factoring the number of cells and a simple test of the browser's performance on page load into the 'play' speed.

Progressive Enhancement
-----------------------

The game should work reasonably well for most any user agent, and has been tested in lynx, chrome 49 and Android, Firefox 48 and Android, Safari 5.1, IE 8 & 11, simulated IE 5 & 7 & 9 & 10, Edge, Opera 12, and Opera Mini 7.

My base level test for JS support is `querySelectorAll()`.  I'm not sure why I put the extra effort to support `attachEvent()`, etc, but I did, so IE 8+ is supported.  I block Opera Mini specifically, because it already has to go to a server for ticks and 'play' makes no sense server-rendered.

- **game logic**: I implemented the game logic server side so that it could run without JS.  I also implemented the game logic in JS to enhance the experience, providing speedier running without trips to the server, and automatic play.  JS-only buttons are injected via JS so they aren't there for no-js no-css.
- **grid styling**: The grid shows as a table with 'X's and 'O's in `<abbr>` with titles for no-css browsers and screen-readers.  Basic CSS support uses `display` of `block`, `inline`, and `inline-block` with fixed dimensions and colored backgrounds to enhance the situation.  Flexbox supporting browsers (modern standard only) get a flexible grid that fits to the screen.
- **settings pane**: For browsers that don't support `:target`, the settings show below the grid.  For `:target` browsers they overlay the page.  A blocker covers the rest of the screen and is a link to `#`, so when clicked, it closes the pane without JS.  `transition` supporting browsers will give a little animation opening and closing the pane.  A JS enhancement closes the pane with the escape key.

A11Y
----

I mostly relied on semantic HTML and built-in browser behavior for accessibility.  Some project-specific examples include:

- I switch links to buttons when they take on JS behavior.
- Cells are in a table so row and column numbers can be associated.
- Cells contain `abbr` with titles or 'X's and 'O's so screen readers can have terse or descriptive content.
- The settings pane is simply an anchor target, so supporting browsers can automatically move focus to the right place.


Design
------

I am not really a designer, but I have absorbed some basic principles.

- **color scheme**: Green or white on black emphasizes the programming connection of the game and provides good contrast.  Green emphasizes life and is my favorite color.  Brown is a reasonable color for death and provides a reasonable level of contrast with the green and the black.
- **fonts**: Monospace emphasizes the programming connection of the game.
- **cell appearance**: I wanted to give the cells a look inspired by real cells.  I gave them an off-round shape and a nucleus.  I threw in a little variance, as real cells would have.  I chose a compromise of transfer weight, visibility, browser support, and lifelikeness.
- **layout**: I wanted the game grid to be full-screen or as close to it as possible.  I used flexbox so it could handle any grid size.  Older browsers fall back to a fixed sized grid.
- **icons**: Actions looked too plain without icons.  I went with simple icons made of CSS shapes or generated text.
- **text links**: Link text is always shown, preferring understandability over clean and well-fitting appearance on small screens.

Build
-----

For this project, I went with building my own task-runner in the project's server-side language, PHP.  It calls the CLI versions of SASS, uglify js, and postcss where applicable, with the proper arguments so I don't have to remember them.  I liked this a lot.

This project considers everything that goes in the web-root to be generated, including all `index.php` files.  The web-root is the same as the project-root to simplify deployment on Azure.

VCS
---

I use git, as I do with most code projects these days.  Because I like to keep generated content out of version control, I made a separate branch to hold generated content.  I created a script to bring in the changes from the clean branch and update the remote.  The master branch is the generated one because the Azure deployment required it to be.  So I have the following branches:

- **src**: the clean branch that I work in
- **master**: the generated branch that gets 'src' merged into it, then a build commit if applicable, when I push
- **dist**: this is another generated branch that I wanted to keep a cleaner history with.  It rebases 'src' and then amends its build commit, staying compatible with 'src'.  This does require a force push, though, which is incompatible with the Azure deployment method.
