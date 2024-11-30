import Cookies from 'js-cookie';

export const getLocation = async () => {
    // Check if location is already stored in cookies
    const savedLocation = Cookies.get('userLocation');
    if (savedLocation) {
        return JSON.parse(savedLocation);
    }

    // If not in cookies, prompt the user for location
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            const askForLocation = window.confirm(
                'Would you like to share your location?'
            );
            if (askForLocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const locationData = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        // Save location in cookies (expires in 1 day)
                        Cookies.set('userLocation', JSON.stringify(locationData), {
                            expires: 1,
                        });
                        resolve(locationData);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        reject('Unable to retrieve location.');
                    }
                );
            } else {
                reject('User denied location sharing.');
            }
        } else {
            reject('Geolocation is not supported by this browser.');
        }
    });
};
