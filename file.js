// ==UserScript==
// @name        Yen->USD WebConverter
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      balds235
// @description 5/17/2024, 11:14:21 AM
// ==/UserScript==
(function() {
    'use strict';

    const apiKey = '30fad3b44f78e0047c193794';
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/JPY`;

    // Function to fetch the exchange rate and convert yen to USD
    async function convertYenToUSD() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const rate = data.conversion_rates.USD;

            // Select all elements that could have yen values
            const yenElements = document.querySelectorAll('body *:not(script):not(style):not(link):not(meta):not(title)');

            yenElements.forEach(element => {
                const yenText = element.innerHTML.match(/¥\d+(,\d{3})*(\.\d+)?/g);
                if (yenText) {
                    yenText.forEach(yenValue => {
                        const yenAmount = parseFloat(yenValue.replace(/[^0-9.-]+/g,""));
                        const usdAmount = (yenAmount * rate).toFixed(2);
                        const formattedYen = formatNumberWithCommas(yenAmount);
                        const formattedUsd = formatNumberWithCommas(usdAmount);
                        const newValue = `¥${formattedYen} (≈ $${formattedUsd} USD)`;
                        element.innerHTML = element.innerHTML.replace(yenValue, newValue);
                    });
                }
            });
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
        }
    }

    // Function to format numbers with commas
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Run the conversion function when the page is loaded
    window.addEventListener('load', convertYenToUSD);

})();
