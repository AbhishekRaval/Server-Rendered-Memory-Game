defmodule Memory.Game do
	
	def game_vars do
		%{height: 4, width: 4, str: "AABBCCDDEEFFGGHH"}
	end

	def game_state do
		%{wfc: "Waiting_First_Card" ,
		wsc: "Waiting_Second_Card",wtc: "Flipp_Uncorrect_cards"}
	end

	def new do
		%{
			cards: init_card()|>Enum.chunk_every(4),
			gameState: game_state().wfc,
			firstcard: nil,
			secondcard: nil,
			count: 0,
			score: 0,
			percent: 0,
			height: game_vars().height,
			width: game_vars().width,
			str: game_vars().str,
			flag: 0
		}
	end

	def init_card do
		str = game_vars().str;
		stringList = String.graphemes(str)
		card = Enum.map(stringList,fn(x) -> 
			%{cardValue: x,flipped: false,colstate: 0} end)
		Enum.shuffle(card)
	end

	def handleclickfn(game,i,j) do
		card = game.cards
		card = card|>List.flatten
		curri = i*game.width + j
		currcard = Enum.at(card,curri)
		currcardval = currcard.cardValue

		if(!currcard.flipped && game.flag === 0) do
			cond do
				game.gameState === game_state().wfc  ->
					currcard = Map.replace!(currcard, :flipped, true)
					currcard = Map.replace!(currcard, :colstate, 0)
					card_Send = List.replace_at(card, curri, currcard)
					countUp = game.count + 1
					fc = %{ :iIndex => i, :jIndex => j}
					%{cards: card_Send|>Enum.chunk_every(4),
					score: game.score,
					height: game_vars().height,
					width: game_vars().width,
					str: game_vars().str,
					firstcard: fc,
					secondcard: nil,
					count: countUp,
					percent: game.percent,
					gameState: game_state().wsc,
					flag: 0}

				game.gameState === game_state().wsc ->		
					card = game.cards
					card = card|>List.flatten

				#storing values of firstcard in local variable
				firstcardIndex = game.firstcard.iIndex*game.width+game.firstcard.jIndex
				firstcardtemp = Enum.at(card,firstcardIndex)	
				firstCardVal = firstcardtemp.cardValue

				#flipping second card
				currcard = Map.replace!(currcard, :flipped, true)
				card_Send = List.replace_at(card, curri, currcard)
				sc = %{:iIndex => i, :jIndex => j}

				if firstCardVal === currcardval do 

					#set both colstate to 1
					firstcardtemp1 = Map.replace!(firstcardtemp, :colstate, 1)
					currcard = Map.replace!(currcard, :colstate, 1)

					card_Send = List.replace_at(card,firstcardIndex,firstcardtemp1)		
					card_Send2 = List.replace_at(card_Send,curri, currcard)

				#getting Percentage

				percCount = length(Enum.filter(card_Send2,fn(x)->x.flipped end))

				percentage = (percCount/(game.height*game.width))*100


				countUp = game.count + 1
				currscore = game.score + 25 + game.count

				%{cards: card_Send2|>Enum.chunk_every(4),
				score: currscore,
				height: game_vars().height,
				width: game_vars().width,
				str: game_vars().str,
				firstcard: nil,
				secondcard: nil,
				count: countUp,
				percent: percentage,
				gameState: game_state().wfc,
				flag: 0}

			else
				countUp = game.count + 1
				currscore = game.score - 25 - game.count
				%{cards: card_Send|>Enum.chunk_every(4),
				score: currscore,
				height: game_vars().height,
				width: game_vars().width,
				str: game_vars().str,
				firstcard: game.firstcard,
				secondcard: sc,
				count: countUp,
				percent: game.percent,
				gameState: game_state().wfc,
				flag: 2}	
			end
		end
		else
			%{cards: game.cards,
			score: game.score,
			height: game_vars().height,
			width: game_vars().width,
			str: game_vars().str,
			firstcard: game.firstcard,
			secondcard: game.secondcard,
			count: game.count,
			percent: game.percent,
			gameState: game.gameState,
			flag: game.flag}				
		end

	end

	def client_view(game) do
		%{
			cards: game.cards,
			score: game.score,
			height: game_vars().height,
			width: game_vars().width,
			str: game_vars().str,
			firstcard: game.firstcard,
			secondcard: game.secondcard,
			count: game.count,
			percent: game.percent,
			gameState: game.gameState,
			flag: game.flag
		}
	end

	def unflipfn(game) do
		card = game.cards
		cards = card|>List.flatten

		firstcardIndex = game.firstcard.iIndex*game.width+game.firstcard.jIndex
		seconcardIndex = game.secondcard.iIndex*game.width+game.secondcard.jIndex

		firstcardtemp = Enum.at(cards,firstcardIndex)
		secondcardtemp = Enum.at(cards,seconcardIndex)

		firstcardtemp1 = Map.replace!(firstcardtemp, :flipped, false)
		secondcardtemp1 = Map.replace!(secondcardtemp, :flipped, false)

		card_Send = List.replace_at(cards, firstcardIndex,firstcardtemp1)
		card_Send1 = List.replace_at(card_Send,seconcardIndex,secondcardtemp1)
		:timer.sleep(1000)
		%{
			cards: card_Send1|>Enum.chunk_every(4),
			score: game.score,
			height: game_vars().height,
			width: game_vars().width,
			str: game_vars().str,
			firstcard: nil,
			secondcard: nil,
			count: game.count,
			percent: game.percent,
			gameState: game.gameState,
			flag: 0
		}
	end
end