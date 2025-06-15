const axios = require("axios");

const welcome = async (req, res) => {
    const data = {
        'name': req.query.name || 'Guest',
        'message': 'Welcome to our website!'
    };
    res.status(200).json({ url: `${req.url}`, data });
}

const remarks = async (req, res) => {
    const data = [
        {
            'name': 'Remark 1',
            'description': `Please enjoy the user experience from home to about us
            and be mindful that our team is working on more content that will be coming soon.`
        }
    ];
    res.status(200).json({ url: `${req.url}`, data });
}

const comments = async (req,res) => {
    res.status.json({ url: `${req.url}`, data })
}

const homepage = async (req, res) => {
    try {
        const answer = await axios.get(
            'https://api.unsplash.com/photos/random',
            {
                params: {
                    count: 12,
                    client_id: process.env.UNSPLASH_ACCESS_KEY
                }
            }
        );
        let data = [];
        answer.data.forEach(element => {
            data.push(element.urls.regular);
        });
        res.status(200).json({ url: `${req.url}`, data });
    } catch (err) {
        res.status(401).json({ error: "Unauthorized. Check your Unsplash access key." });
    }
};

const services = async(req, res) => {
    try {
        const answer = await axios.get(
            'https://api.unsplash.com/photos/random',
            {
                params: {
                    count: 12,
                    client_id: process.env.UNSPLASH_ACCESS_KEY
                }
            }
        );
        let data = [];
        answer.data.forEach(element => {
            data.push(element.urls.regular);
        });
        res.status(200).json({ url: `${req.url}`, data });
    } catch (err) {
        res.status(401).json({ error: "Unauthorized. Check your Unsplash access key." });
    }
};

const contacts = (req, res) => {
    const data = [
        {
            'name': 'Ngoja George William',
            'address': 'jinja',
            'contact': '0775021976'
        },
    ];
    res.status(200).json({ url: `${req.url}`, data });
};

const aboutUs = (req, res) => {
    const data = [
        {
            'name': 'About Us',
            'description': 'We are a company that provides excellent services.'
        },
        {
            'name': 'Our Mission',
            'description': 'To heed to the MAVERICK_CODE.'
        },
        {
            'name': 'Our Vision',
            'description': 'To be the leading provider of projects that will build and unite people in a single non-stereotyped community.'
        },
        {
            'name': 'COMING SOON!!!',
            'description': 'We are working hard to bring you more information about us. Stay tuned!'
        }
    ];
    res.status(200).json({ url: `${req.url}`, data });
};

module.exports = { homepage, services, contacts, aboutUs, welcome, remarks, comments };