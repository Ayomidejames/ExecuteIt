const fetchQuote = async(req, res) => {
    try {
        const quoteURI = process.env.API_NINJA_URI
        const response = await fetch(quoteURI, {
            headers: {'X-Api-Key': process.env.API_NINJA_KEY}
        });
        if (!response.ok) throw new Error("External API Error");

        // accepts the data in JSON format
        const data = await response.json();
        res.json({
            success: true,
            quote: data
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

module.exports = fetchQuote