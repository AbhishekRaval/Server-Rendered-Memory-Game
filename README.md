# Memory Game Rules

Built a pair-of-tiles memory matching game with the following properties:

Uses React to display and update the game board.

The state of the game is a single value in the root React component.

Game displays a 4x4 grid of tiles, but can the grid size can be customized by changing height width in react component.

Each tile have an associated value: A letter in the range A-H.

Each letter value would be associated with exactly two tiles.

Initially, the letters associated with the tiles are hidden.

Clicking on a tile exposes it's associated letter.

Clicking on a second tile is a guess that it matches the value of the first tile.

Guessing would expose the value of the second tile, and then:

  If the two tiles match, then both tiles would be marked completed.
  
  If the two tiles don't match, the values would be hidden again after a delay (one second is a good delay; clicks during the delay       should either be ignored or should skip the remainder of the delay)
  
Once the guess is resolved, no non-completed tile values would be exposed, and the user can click another first tile to guess about.

The number of clicks to match all the pairs (complete all the tiles) would be tracked. Less clicks is a better score at the game.

There is a mechanism (e.g. a button) to restart the game at any time.

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

