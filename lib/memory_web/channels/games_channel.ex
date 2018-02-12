defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel
  alias Memory.Game
  def join("games:" <> name, payload, socket) do
    game = Memory.GameBackup.load(name) || Game.new

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

 def handle_in("unflipfn",%{}, socket) do
    game_init = socket.assigns[:game]
    game_fn = Game.unflipfn(game_init)
    Memory.GameBackup.save(socket.assigns[:name], game_fn)
    socket = socket|>assign(:game, game_fn)
    {:reply, {:ok, %{"game" => Game.client_view(game_fn)}}, socket}
  end

  def handle_in("resetfn", %{}, socket) do
    game_fn = Game.new()
    Memory.GameBackup.save(socket.assigns[:name], game_fn)
    socket = assign(socket, :game, game_fn)
    {:reply, {:ok, %{"game" => Game.client_view(game_fn)}}, socket}
  end

  def handle_in("handleclickfn", %{"i" => i, "j" => j}, socket) do
    game_init = socket.assigns[:game]
    game_fn = Game.handleclickfn(game_init,i,j)
    Memory.GameBackup.save(socket.assigns[:name], game_fn)
    socket = socket|>assign(:game, game_fn)
    {:reply, {:ok, %{"game" => Game.client_view(game_fn)}}, socket}
  end


 
  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
