import { Weather } from '@/types/editor';

export function getWeatherEmoji(weather: Weather, time: number) {
	const id = weather.id;
	const night = time < 3 || time > 17;

	if (id < 300) {
		return `⛈`;
	} else if (id < 400) {
		return `🌧`;
	} else if (id < 511) {
		return `🌧`;
	} else if (id < 520) {
		return `❄️`;
	} else if (id < 600) {
		return '🌧';
	} else if (id < 700) {
		return `❄️`;
	} else if (id < 800) {
		return `🌫`;
	} else if (id === 800) {
		if (night) {
			return `🌙`;
		}
		return `☀️`;
	} else if (id === 801) {
		if (night) {
			return `☁️`;
		}
		return `🌤`;
	} else if (id === 802) {
		return `☁️`;
	} else if (id > 802) {
		if (night) {
			return `☁️`;
		}
		return `⛅️`;
	}

	return `🌡️`;
}

export function kelvinToFahrenheit(tempK: number) {
	return Math.floor(((tempK - 273.15) * 9) / 5 + 32);
}
