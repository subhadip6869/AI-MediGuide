const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const geminiConfig = {
	temperature: 2
}
const safetySettings = [
	{
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_NONE
	},
	{
		category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
		threshold: HarmBlockThreshold.BLOCK_NONE
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_NONE
	},
	{
		category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
		threshold: HarmBlockThreshold.BLOCK_NONE
	},
	// {
	// 	category: HarmCategory.HARM_CATEGORY_VIOLENCE,
	// 	threshold: HarmBlockThreshold.BLOCK_NONE
	// }
]
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// search information from internet (e.g.: mor.nlm.nih.gov/RxNav/, dailymed.nlm.nih.gov/dailymed/, medicinesdatabase.be/human-use, go.drugbank.com/, drugcentral.org/, www.webmd.com/drugs/2/index, myhealthbox.eu/ etc.) and give stable & valid data. if medicine have multiple ingredients then list out all. 

// (example: https://www.amazon.com/s?k=, https://www.amazon.in/s?k=, https://www.walmart.com/search/?query=, https://www.walgreens.com/search/results.jsp?Ntt=, cvs, https://www.netmeds.com/catalogsearch/result/$searchKeyword/all, https://pharmeasy.in/search/all?name=, https://www.truemeds.in/search/$searchKeyword etc.)

// give information in json format so that i can structure using JSON.parse() in nodejs

router.post("/info", async (req, res) => {
	const { medicines } = req.body;

	const prompt = `Here is a list containing medicine names, provide information on these medicines as list of json, format should be: {"NAME": string, "MANUFACTURER": string, "PRODUCT_FORM": string, "INGREDIENT": array, "USAGE": string, "SIDE_EFFECT": string, "PRECAUTION": string, "CATEGORY": string, "PRESCRIPTION_REQUIRED: boolean "PRODUCT_URL": [string], "INVALID_MESSAGE": string}.

	Give all possible information, if not give blank. If medicine name is invalid give message at INVALID_MESSAGE.

	Also provide online store urls of the medicine - when i go to that link it should display that product. - follow their search pattern of each website strictly on the url - could be multiple stores url (example: https://www.amazon.com/s?k=, https://www.amazon.in/s?k=, https://www.walmart.com/search/?query=, https://www.walgreens.com/search/results.jsp?Ntt=, cvs, https://www.netmeds.com/catalogsearch/result/$searchKeyword/all, https://pharmeasy.in/search/all?name=, https://www.truemeds.in/search/$searchKeyword etc.).
    
    List: [${medicines}]`;

	try {
		const result = await model.generateContent(prompt, geminiConfig, safetySettings);
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
		// console.log(resFormatted);

	} catch (error) {
		// console.log(error);
		res.status(400).json({
			status: 400,
			message: error.message,
		});
	}
});

router.get("/symptom", async (req, res) => {
	try {
		const symptomJson = JSON.parse(fs.readFileSync(path.join(__dirname, "model", "symptoms.json"), "utf-8"));
		const sympList = [];
		for (let s of symptomJson["symptoms"]) {
			sympList.push(s["name"]);
		}
		res.status(200).json({
			status: 200,
			data: sympList
		})
	} catch (e) {
		res.status(500).json({
			status: 500,
			message: e.message
		});
	}
})

router.post("/symptom", async (req, res) => {
	try {
		const symptomJson = JSON.parse(fs.readFileSync(path.join(__dirname, "model", "symptoms.json"), "utf-8"));
		const { symptoms } = req.body;
		// get only the matched symptoms data
		const selected = symptomJson["symptoms"].filter(s => symptoms.includes(s["name"]));
		// flatten the data to have symptoms with each medicine object
		const flattenedList = selected.flatMap(symp => symp.medicines.map(med => ({
			symptom: symp["name"],
			...med
		})));
		// merge if a medicine is used for multiple symptoms & purposes
		const mergedMeds = new Map();
		for (let med of flattenedList) {
			if (mergedMeds.has(med.name)) {
				mergedMeds.get(med.name).symptoms.push(med.symptom);
				mergedMeds.get(med.name).purpose.push(med.purpose);
			} else {
				mergedMeds.set(med.name, {
					name: med.name,
					brand: med.brand,
					symptoms: [med.symptom],
					purpose: [med.purpose]
				});
			}
		}

		res.status(200).json({
			status: 200,
			data: Array.from(mergedMeds.values())
		});
	} catch (e) {
		res.status(500).json({
			status: 500,
			message: e.message
		});
	}
});

module.exports = router;
