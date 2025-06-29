import * as fs from 'node:fs'


const inputFilePath = 'raw_transcript.txt';
const outputFilePath = 'convertedJsonTranscript';

function convertScriptToJson(rawTranscript) {

    const lines = rawTranscript.split('\n');

    const trasncriptJson = [];
    let startTime = null;
    let endTime = null;
    let content = "";

    for (const line of lines) {
        const trimmedLine = line.trim()
        const timeMatch = line.trim().match(/^(\d{1,2}:\d{2})/);
        
        if (timeMatch) {
            if (startTime!==null) {
                trasncriptJson.push({
                    content: content.trim(),
                    start_time: startTime,
                    // The end time is the start time of the next segment.
                    end_time: timeMatch[1]
                });
            }

            startTime = timeMatch[1];
            content = trimmedLine.substring(timeMatch[0].length).trim();
        } else {
            content += " " + trimmedLine;
        }
    }

    if (startTime && content.trim()) {
        trasncriptJson.push({
            content: content.trim(),
            start_time: startTime,
            end_time: null
        });
    }

    return trasncriptJson
    
}

const raw_transcript = `0:00 This is the first sentence.
0:05 Here is the second.
0:10 And the third.
0:15 This is a long sentence that spans across
multiple lines.
0:25 A new timestamp starts here.
0:30 And the final sentence.`;

//Read from requirements.txt initially, then writing it into json
fs.readFile(inputFilePath, 'utf-8', (err, data) => {
    if (err) {
        console.log('Error reading the file:', err);
        return;
    }

    const raw_transcript_data = data;
    const jsonOutput = convertScriptToJson(raw_transcript_data);
    const jsonString = JSON.stringify(jsonOutput, null, 2);
    console.log(JSON.stringify(jsonOutput, null, 2));

    fs.writeFile(outputFilePath, jsonString, 'utf-8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing the output file', writeErr);
            return;
        }
        console.log('Successfully wrote JSON to ${ouputFilePath}');

    });

});
