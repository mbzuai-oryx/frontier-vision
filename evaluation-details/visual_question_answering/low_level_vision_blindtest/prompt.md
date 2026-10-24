# BlindTest: prompt
Placeholders in `{braces}` are filled per item.

## System
````text
Examine the geometric details in the image carefully. Trace complete contours or paths and distinguish crossings from connections. Count each requested object exactly once, including overlapping or nested objects when relevant. Verify the result against the image, then follow the question's requested answer format.
````

## User turn
````text
<image>
{prompt}
````

`{prompt}` is the item's own `prompt` field. The question texts are listed by task below.

## Question texts from the dataset, by task
- **Line Plot Intersections** (1800 items): `How many times do the blue and red lines touch each other? Answer with a number in curly brackets, e.g., {5}.`
- **Line Plot Intersections** (1800 items): `Count the intersection points where the blue and red lines meet. Put your answer in curly brackets, e.g., {2}.`
- **Touching Circles** (672 items): `Are the two circles touching each other? Answer with Yes/No.`
- **Touching Circles** (672 items): `Are the two circles overlapping? Answer with Yes/No.`
- **Circled Letter** (312 items): `Which letter is being circled? Please provide your answer in curly brackets, e.g. {a}`
- **Circled Letter** (312 items): `Which character is being highlighted with a red oval? Please provide your answer in curly brackets, e.g. {a}`
- **Counting Grid - Word Grids, Counting Grid - Blank Grids** (264 items): `Count the number of rows and columns and answer with numbers in curly brackets. For example, rows={5} columns={6}`
- **Counting Grid - Word Grids, Counting Grid - Blank Grids** (264 items): `How many rows and columns are in the table? Answer with only the numbers in a pair (row,column), e.g., (5,6).`
- **Olympic Counting - Circles** (240 items): `How many circles are in the image? Answer with only the number in numerical format.`
- **Olympic Counting - Circles** (240 items): `Count the circles in the image. Answer with a number in curly brackets e.g. {3}.`
- **Olympic Counting - Pentagons** (240 items): `How many pentagons are in the image? Answer with only the number in numerical format.`
- **Olympic Counting - Pentagons** (240 items): `Count the pentagons in the image. Answer with a number in curly brackets e.g. {3}.`
- **Subway Connections** (121 items): `How many single-color paths go from C to A? Answer with a number in curly brackets e.g. {3}`
- **Subway Connections** (121 items): `Count the one-colored routes that go from C to A. Answer with a number in curly brackets e.g. {3}`
- **Nested Squares** (120 items): `Count total number of squares in the image. Answer with only the number in numerical format in curly brackets e.g. {3}.`
- **Nested Squares** (120 items): `How many squares are in the image? Please answer with a number in curly brackets e.g., {10}.`
- **Subway Connections** (115 items): `How many single-color paths go from B to D? Answer with a number in curly brackets e.g. {3}`
- **Subway Connections** (115 items): `Count the one-colored routes that go from B to D. Answer with a number in curly brackets e.g. {3}`
- **Subway Connections** (37 items): `How many single-color paths go from C to D? Answer with a number in curly brackets e.g. {3}`
- **Subway Connections** (37 items): `Count the one-colored routes that go from C to D. Answer with a number in curly brackets e.g. {3}`
- **Subway Connections** (33 items): `How many single-color paths go from B to A? Answer with a number in curly brackets e.g. {3}`
- **Subway Connections** (33 items): `Count the one-colored routes that go from B to A. Answer with a number in curly brackets e.g. {3}`
- **Subway Connections** (29 items): `How many single-color paths go from D to A? Answer with a number in curly brackets e.g. {3}`
- **Subway Connections** (29 items): `Count the one-colored routes that go from D to A. Answer with a number in curly brackets e.g. {3}`
- **Subway Connections** (25 items): `How many single-color paths go from C to B? Answer with a number in curly brackets e.g. {3}`
- **Subway Connections** (25 items): `Count the one-colored routes that go from C to B. Answer with a number in curly brackets e.g. {3}`
