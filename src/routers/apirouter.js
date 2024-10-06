const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const geminiConfig = {
	temperature: 1.5
}
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", geminiConfig });

// search information from internet (e.g.: mor.nlm.nih.gov/RxNav/, dailymed.nlm.nih.gov/dailymed/, medicinesdatabase.be/human-use, go.drugbank.com/, drugcentral.org/, www.webmd.com/drugs/2/index, myhealthbox.eu/ etc.) and give stable & valid data. if medicine have multiple ingredients then list out all. 

router.post("/info", async (req, res) => {
	const { medicines } = req.body;

	const prompt = `Here is a list containing medicine names, provide information on these medicines as list of json, format should be: {"NAME": string, "MANUFACTURER": string, "INGREDIENT": array, "USAGE": string, "SIDE_EFFECT": string, "PRECAUTION": string, "CATEGORY": string, "PRESCRIPTION_REQUIRED: boolean "PRODUCT_URL": [string], "IMAGE_URL": string, "INVALID_MESSAGE": string}.

	Give all possible information, if not available give blank. If the medicine name is invalid, then give invalid message at INVALID_MESSAGE.

	Also provide online store urls of the medicine - when i go to that link it should display that product, shouldn't show "page not found 404" - follow their search pattern of that each website on the url - could be multiple stores url.

	give information in json format so that i can structure using JSON.parse() in nodejs
    
    List: [${medicines}]`;

	try {
		const result = await model.generateContent(prompt);
		let resultData = result.response.text();

		let resFormatted;
		try {
			resFormatted = JSON.parse(resultData);
			res.status(200).json({ status: 200, data: resFormatted });
		} catch (e) {
			try {
				resFormatted = resultData.match(/```json(.|\n)*```/g);
				resFormatted = resFormatted[0]
					.replace("```json", "")
					.replace("```", "");
				resFormatted = JSON.parse(resFormatted);
				res.status(200).json({ status: 200, data: resFormatted });
			} catch (_) {
				resFormatted = "Something went wrong";
				res.status(500).json({
					status: 500,
					message: resFormatted,
				});
			}
		}
	} catch (error) {
		res.status(400).json({
			status: 400,
			message: error.message,
		});
	}
});

module.exports = router;
