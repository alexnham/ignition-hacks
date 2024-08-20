
# DOCTALK

## To Do List

    - Login
    - Database to store clients
    - Cleanup PDF
    - Organize Client data
    - Adjustable Notes before pdf

## Inspiration
Doctors are heroes. Their lives are fast-paced and action-packed, from delivering new lives to saving them. But have you ever heard of a hero who has to do paperwork after a battle? Neither have we. However, what many people don’t realize is that doctors spend hours each day documenting patient interactions to keep records up-to-date. This is problematic for several reasons. Doctors often see 2-4 patients back-to-back before sitting down to write notes, which means they might forget parts of the consultation and risk omitting important details. Additionally, doctors need short breaks during the day to mentally recharge, but instead, they spend their "free time" filling out notes. Most importantly, the time doctors spend on documentation takes away from time they could be spending with patients, providing care and being the heroes they are.

## What it Does
To address this issue, our team developed an app called **DocTalk**. It enables doctors to create detailed patient notes without typing a single word. Doctors simply input the patient’s name, date, and hit the record button. The app records the conversation with the patient (with their consent) and then automatically summarizes it into a detailed patient record at the end of the consultation. The notes also include actionable information, such as medication recommendations, which doctors can use to treat patients. This allows doctors to focus fully on their patients during consultations and get detailed records without lifting a finger.

## How We Built It
Building this app involved integrating multiple components. For the backend, where the main processing occurs, we used **JavaScript (Node.js)**, **Deepgram API**, **Wolfram Alpha API**, and **OpenAI API**. Using **React**, we created a button that, when clicked, records the conversation and stores it as a `.wav` file. The **Deepgram API** then converts this audio file into a text transcript. Next, **OpenAI** analyzes the transcript, differentiating between doctor and patient dialogue using contextual clues. It then summarizes the important parts of the conversation, creates jot notes for future reference, and removes any unnecessary information. Lastly, the **Wolfram Alpha API** is used to scan the patient's symptoms, predict possible diagnoses and suggest potential treatments, such as medications the doctor might prescribe. The frontend is wrapped with **Tailwind CSS** and **React** on the front end, providing a user-friendly interface.

## Challenges We Faced
We encountered a few challenges along the way. One major challenge was converting the transcript created by Deepgram into a structured script where doctor and patient dialogue were differentiated. Initially, we tried manually splitting sentences and using voice detection software, but this proved ineffective due to too many assumptions. We solved this by leveraging **OpenAI** and machine learning to recognize contextual differences in the conversation (e.g., the sentence "tell me what brings you in" is typically said by a doctor). Another challenge was managing the extensive knowledge base of **Wolfram Alpha**, which sometimes produced too many results and disrupted the formatting of the records. We resolved this by setting limits on the output, taking only the top responses (which were the most relevant), and fine-tuning the formatting through trial and error.

## Accomplishments We’re Proud Of
We’re proud of several accomplishments from this hackathon. We successfully utilized **Wolfram Alpha** to enhance patient records with treatment suggestions. We’re also proud of our ability to connect multiple APIs, such as **Deepgram**, **OpenAI**, and **Wolfram Alpha**, into a cohesive system. Finally, we created a clean, simple, yet effective user interface using **React** and **Tailwind CSS**. We designed the app to be as straightforward as possible on the outside, yet detailed in the records it produces, knowing that doctors already have a lot on their minds.

## What We Learned
During this project, we learned a great deal about integrating diverse technologies to create a seamless user experience. **React** and **Tailwind CSS** were essential in building a responsive front-end, ensuring the user interface was intuitive and easy to navigate. **Node.js** and **Express** helped us create our own API endpoints.

A significant part of the project involved connecting various APIs, such as **Deepgram** for speech recognition, **Wolfram Alpha** for data processing, and **OpenAI** for generating summaries. Each API presented its own challenges, but by effectively managing these integrations, we created a cohesive system where different technologies work together seamlessly. This experience deepened our technical skills and taught us the importance of flexibility and problem-solving when working with complex workflows.

## What’s Next for DocTalk
**DocTalk** is dedicated to continuing its mission to serve doctors. We plan to refine the app to ensure smooth performance, maintain high output standards, and update the formatting and visuals regularly. Future features include the ability to email forms to other doctors and patients, integrate additional forms (such as blood work), and enhance the app to be a comprehensive medical tool that could eventually replace current documentation systems.

