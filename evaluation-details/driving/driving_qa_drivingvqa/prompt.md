# DrivingVQA (test): prompt
Placeholders in `{braces}` are filled per item.

## User turn
````text
<image>
Unless explicitly stated otherwise, assume you are driving a car in France.
Select all correct answers to the following question from the available options.

Question: {question}
Options:
({letter}) {option_text}

Provide the letters corresponding to your answer in the format: 'Answer(s): <letters>'.
````

## Wording by exam type and question count
**Car, one question**

````text
Unless explicitly stated otherwise, assume you are driving a car in France.
Select all correct answers to the following question from the available options.

Question: {question}
Options:
({letter}) {option_text}

Provide the letters corresponding to your answer in the format: 'Answer(s): <letters>'.
````
**Car, several questions**

````text
Unless explicitly stated otherwise, assume you are driving a car in France.
Select all correct answers to the following questions from the available options. Choose at least one answer per question.

Question: {question}
Options:
({letter}) {option_text}

Provide the letters corresponding to your answer in the format: 'Answer(s): <letters>'.
````
**Motorcycle, one question**

````text
Unless explicitly stated otherwise, assume you are driving a motorcycle in France.
Select all correct answers to the following question from the available options.

Question: {question}
Options:
({letter}) {option_text}

Provide the letters corresponding to your answer in the format: 'Answer(s): <letters>'.
````
**Motorcycle, several questions**

````text
Unless explicitly stated otherwise, assume you are driving a motorcycle in France.
Select all correct answers to the following questions from the available options. Choose at least one answer per question.

Question: {question}
Options:
({letter}) {option_text}

Provide the letters corresponding to your answer in the format: 'Answer(s): <letters>'.
````