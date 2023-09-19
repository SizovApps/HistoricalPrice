<h1>Обзор решения:</h1>

<h3>Общий алгоритм:</h3>
1) Получить пару <TOKEN_NAME>/WETH и Dex (UniswapV2 или UniswapV3, SushiSwap приравнивается к UniswapV2, так как у них одинаковый ABI для Swap и Transfer)
2) Получить номер блока по timestamp
3) Получить транзакции свапа токена в блоке.
    Если в блоке нет транзакций, то расширяем границы поиска до (block - 15, block + 15), это равняется двум минутам. 
    Если снова нет транзакций - то расширяем до 5 минут, затем до 10. Если транзакций нет - то возврящаем null (токен мертвый).
4) Получаем количество токенов, затраченных при обмене.
5) Возвращаем сумму

<h4>Получение пары:</h4>
<p>Из uniswap SDK получаем ABI UniswapV2Router, создаем контракт, вызываем метод getPair. Если нет пары, значит идем искать в UniswapV3.</p>
<p>Получаем пару, вызывая метод контракта "getPool", который помимо токенов принимает fee. Получить fee программным способом невозможно, поэтому перебираем по всем вариантам fee (смотрел на пары, других вариантов fee не видел).</p>
<p>Возвращаем пару + кешируем токен, чтобы заново не искать</p>

<h4>Получить номер блока по timestamp:</h4>
<p>Бин поиском искать долго, поэтому беру среднее время создания блоков за последние 500 блоков.
Нахожу номер блока</p>
<p>Если берем timestamp 3-дневной давности - то расхождение 3 блока (36 секунд).
По хорошему хранить в БД номера блоков и их timestamp. Периодически вызывать на сервере функцию, которая будет добавлять последние блоки. Так как хранится пара чисел, то проблем по памяти не будет.</p>

<h4>Получить транзакции свапа токена в блоке:</h4>
<p>Дергаем ручку - https://docs.etherscan.io/api-endpoints/accounts#get-a-list-of-erc20-token-transfer-events-by-address.
Получаем transafer ERC20 токенов. Если транзакция есть - то обрабатываем ее, если нет - то расширяем границы.</p>
<p>Бывает ситуация, когда транзакция нe Swap, а Burn. Тогда запускаем обрабатывать следующую транзакцию в блокe.</p>

<h4>Получаем количество токенов, затраченных при обмене:</h4>
<p>Дергаем ручку - https://docs.etherscan.io/api-endpoints/stats#check-transaction-receipt-status.
Получаем чек транзакции. Нас интересует полу Logs. (пример - https://etherscan.io/tx/0xc90dcfbe67efe831fc800550a90866f4de7d2f825456cc653b1075ac2873042d#eventlog)</p>
<p>В каждом log перемененная topics[0] хранит в себе захэшированный ABI вызываемой функции. Получаем логи свапа, перевода ETH и токена, цену которого ищем.</p>
<p>Далее, декодируем log[data] у логов свапа. Так как свап может быть не один, то ищем тот, у которого сумма токенов находится в transferLogs.</p>
<p>Дергаем ручку - https://docs.etherscan.io/api-endpoints/contracts#get-contract-abi-for-verified-contract-source-codes.
Получаем ABI токена. Вызываем функцию decimals(). На основе decimals приводим сумму токенов к корректному виду. Также хэшируем это значение.</p>
<p>Зная количество ETH и токена, который мы ищем, получаем сумму.</p>

<h2>Запуск:</h2>
<p>Создать в корне файл ".env":<p>
<p>INFURA_URL="YOUR_INFURA_URL"<p>
<p>ETHERSCAN_API_KEY="YOUR_API_KEY"<p>
<p>В консоли: <p>
<p>tsc<p>
<p>node .\target\main.js<p>

<h2>Требования:</h2>
Не удалось найти решения для запуска 100 вызовов функции в секунду. В Etherscan максимальный RPC = 10 (в PRO версии 30).
В Infura аналогично.