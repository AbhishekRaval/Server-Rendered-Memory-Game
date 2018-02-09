# Memory Game Rules
Build a pair-of-tiles memory matching game with the following properties:

Start from the starter code.
Use React to display and update the game board.
The state of the game should be a single value in the root React component.
You should primarily need to create and edit JavaScript source files in assets/js, with some possible changes in assets/css.
Your game should display a 4x4 grid of tiles.
Each tile should have an associated value: A letter in the range A-H.
Each letter value should be associated with exactly two tiles.
Initially, the letters associated with the tiles are hidden.
Clicking on a tile should expose it's associated letter.
Clicking on a second tile is a guess that it matches the value of the first tile.
Guessing should expose the value of the second tile, and then:
If the two tiles match, then both tiles should be marked completed.
If the two tiles don't match, the values should be hidden again after a delay (one second is a good delay; clicks during the delay should either be ignored or should skip the remainder of the delay)
Once the guess is resolved, no non-completed tile values should be exposed, and the user can click another first tile to guess about.
The number of clicks to match all the pairs (complete all the tiles) should be tracked. Less clicks is a better score at the game.
There should be a mechanism (e.g. a button) to restart the game at any time.

## Development Instructions

Prerequisites:

 * Erlang / OTP ~ 20.2
 * Elixir ~ 1.5
 * NodeJS ~ 9.4

To start your Phoenix server:

 * Install dependencies with `mix deps.get`
 * Install Node.js dependencies with `cd assets && npm install`
 * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Deployment Instructions

Instructions to deploy to an Ubuntu 16.04 VPS:

As root:

 * Install Erlang and Elixir packages.
 * Create a new Linux user account, "memory".
 * Add a nginx config for the new site. See "memory.nginx" for an example.

As the new user:

 * Check out this git repository to ~/src/memory
 * Run the deploy script.
   * You may need to answer "Y" and press return.
 * Run the start script to start your server.

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix

Ready to run in production? Please
[check our deployment guides](http://www.phoenixframework.org/docs/deployment).

