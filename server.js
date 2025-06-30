const express = require('express');
const path = require('path')
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/fetchCandiateDetails', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).send('No URL provided');

    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            }
        });

        const $ = cheerio.load(html);
        const result = [];

        $('.main-info-pnl').children('div').first().find('table tbody tr').each((i, element) => {
            const row = $(element).find('td').map((j, cell) => $(cell).text().trim()).get();
            result.push(row);
        });

        if (result.length > 0) {
            res.status(200).json(result);
        }
        else {
            res.status(404).json({ error: 'Candidate data not found' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch or parse the candidate data' });
    }
});

app.post('/fetchCandiateMarks', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'No URL provided' });

    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            }
        });
        const $ = cheerio.load(html);

        const CandidateMarks = {};
        const OverallMarks = {
            totalAttempt: 0,
            totalNotAttempt: 0,
            totalRight: 0,
            totalWrong: 0,
            totalMarks: 0
        };

        $('.grp-cntnr > div').each((i, el) => {
            let subjectName = '';
            let correctOption = 0;
            let marks = 0;
            let attempt = 0;
            let unattempt = 0;
            let wrongAnswer = 0;
            let rightAnswer = 0;

            $(el).children('div').each((index, item) => {
                if (index === 0 && $(item).hasClass('section-lbl')) {
                    subjectName = $(item).find('span').eq(1).text().trim();
                } else {
                    const $tables = $(item).find('table');
                    $tables.each((tableIndex, table) => {
                        if ($(table).hasClass('questionRowTbl')) {
                            $(table).find('tr').each((trIndex, tr) => {
                                if (trIndex >= 3) {
                                    const $td = $(tr).find('td').eq(1);
                                    if ($td.hasClass('rightAns')) {
                                        correctOption = trIndex - 2;
                                    }
                                }
                            });
                        }
                        else if ($(table).hasClass('menu-tbl')) {
                            const optionTick = $(table).find('tr:last td:eq(1)').text().trim();

                            if (optionTick === '--') {
                                unattempt++;
                            } else {
                                attempt++;
                                if (correctOption.toString() === optionTick) {
                                    marks += 2;
                                    rightAnswer++;
                                } else {
                                    wrongAnswer++;
                                }
                            }
                        }
                    });
                }
            });

            OverallMarks.totalAttempt += attempt;
            OverallMarks.totalNotAttempt += unattempt;
            OverallMarks.totalRight += rightAnswer;
            OverallMarks.totalWrong += wrongAnswer;
            OverallMarks.totalMarks += marks;

            if (subjectName) {
                CandidateMarks[i] = {
                    subjectName,
                    marks,
                    attempt,
                    unattempt,
                    rightAnswer,
                    wrongAnswer
                };
            }
        });

        const response = {
            subjects: CandidateMarks,
            overall: OverallMarks
        };

        if (Object.keys(CandidateMarks).length > 0) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ error: 'No candidate marks found' });
        }

    } catch (error) {
        console.error('Error fetching candidate marks:', error);
        res.status(500).json({ error: 'Failed to fetch candidate marks' });
    }
});


app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
