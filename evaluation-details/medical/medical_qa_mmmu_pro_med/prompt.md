# MMMU-Pro-Med: prompt
Placeholders in `{braces}` are filled per item.

## User turn
````text
<image> token, in token order)>
{question}
A. {option_A}
B. {option_B}
C. {option_C}
D. {option_D}
E. {option_E}
F. {option_F}
G. {option_G}
H. {option_H}
I. {option_I}
J. {option_J}
Answer the preceding multiple choice question. The last line of your response should be of the following format: 'Answer: $LETTER' (without quotes) where LETTER is one of options. Think step by step before answering.
````

## Final instruction line (from MMMU-Pro `prompts.yaml`)
````text
cot.standard (runner default --setting standard10)
````
