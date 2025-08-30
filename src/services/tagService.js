const TAGS_API_URL = 'https://apis.allsoft.co/api/documentManagement/documentTags';

export const fetchTags = async (token, term = '') => {
    try {
        if (!token) throw new Error('No token found');

        const response = await fetch(TAGS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token,
            },
            body: JSON.stringify({ term }),
        });

        if (!response.ok) throw new Error(`Failed to fetch tags: ${response.status}`);

        const data = await response.json();
        return data.data?.map(tag => tag.label) || [];
    } catch (error) {
        console.error('fetchTags error:', error);
        return [];
    }
};
