const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const geminiInsight = async (userPrompt) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Sebagai seorang AI yang rasional, understanding, dan heartwarming bisa berikan insight ataupun
     pelajaran yang bisa saya ambil tentang jurnal saya? ini jurnal saya: "${userPrompt}", 
  Berikan respons dalam format JSON dengan struktur sebagai berikut:
  {
    "message": "contoh jawaban",

  }
  Pastikan tidak ada tanda kutip terbalik (\`) atau blok kode \`\`\`json dalam respons.
`;

    const result = await model.generateContent(prompt);
    let response = result.response.text();
    response = JSON.parse(response.trim());
    console.log(response);

    return response;
  } catch (error) {
    console.log(error, "<-- dari helper gemini");
  }
};

module.exports = geminiInsight;
