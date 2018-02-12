defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel
  alias Memory.Game
  def join("games:" <> name, payload, socket) do
    game = Game.new

    socket = socket
    |> assign(:game, game)
    |>assign(:name, name)

    if authorized?(payload) do
      {:ok, %{ "game" => Game.client_view(game) },socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("gamename", %{ "game_name" => game_name }, socket) do
    {:reply, {:gamenamed, %{"yy" => game_name} }, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  def handle_in("resetfn", {}, socket) do
    game1 = Game.new()
    socket = assign(socket, :game, game1)
    {:reply, {:ok, %{"game" => Game.client_view(game1)}}, socket}
  end

  def handle_in("handleclickfn", %{"i" => i, "j" => j}, socket) do
    game0 = socket.assigns[:game]
    game1 = Game.handleclickfn(game0,i,j)
    socket = socket|>assign(:game, game1)
    {:reply, {:ok, %{"game" => Game.client_view(game1)}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
