const AWS = require('aws-sdk');
const axios = require('axios');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        // Get a random cat image from The Cat API
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        const catImageUrl = response.data[0].url;
        
        // Download the image
        const imageResponse = await axios.get(catImageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data);
        
        // Generate random LOL cat text
        const phrases = [
            "I CAN HAS CHEEZBURGER?",
            "OH HAI!",
            "KTHXBYE",
            "IM IN UR AWS, MAKING UR MEMES",
            "CEILING CAT IS WATCHING U"
        ];
        const text = phrases[Math.floor(Math.random() * phrases.length)];
        
        // Upload to S3
        const fileName = `lolcat-${Date.now()}.jpg`;
        await s3.putObject({
            Bucket: process.env.S3_BUCKET,
            Key: fileName,
            Body: imageBuffer,
            ContentType: 'image/jpeg',
            Metadata: {
                'loltext': text
            }
        }).promise();
        
        // Return the URL and text
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'LOLcat generated successfully!',
                url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`,
                text: text
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error generating LOLcat',
                error: error.message
            })
        };
    }
};
