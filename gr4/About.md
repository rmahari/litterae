# **Litterae for Law**

## URL: http://litteraelaw.azurewebsites.net
## GitHub: https://github.com/rmahari/litterae 

## **Acknowledgements:**

Litterae for Law was designed as the final project for Prof. Ron Dolin’s Law 2.0 Course. It was made possible through the work done by Mr. Joren Lauwers and Ms. Sarah Shader on the LITTERAE app, which formed the basis for this project, and Harvard Law School’s Case Law Access Project (CAP) which is used to access court opinions. Mr. Lauwers generously took the time to answer questions I had about the existing code. 

I am tremendously grateful to all people and organizations above.

## **Aim:**

Litterae for Law aims to provide a platform through which court opinions can be annotated. The primary motivation is to build a repository of annotated case law which can be used as a research dataset (primarily intended for data analysis and machine learning). Litterae for Law is a community driven work in progress: anyone is invited to contribute or to take the project in a new direction. Litterae for Law currently has the potential to be a useful tool for law school students or others who wish to annotate cases in a digital and printer friendly format. With some additional refinement, law school instructors could use the platform to assign, annotate and analyze cases with their students (see “Possible Future Work”).


## **Instructions:**

1.	Open Litterae for Law: http://litteraelaw.azurewebsites.net
2.	Type a reporter citation into the search bar and press search, your case should appear on the left side of the window (currently only Illinois and Arkansas are accessible, see “Possible Future Work”). If it does not, try another citation, examples include: 2 Ill. App. 3d 538, 1 Ill. 34, 217 Ill. 2d 669, 364 Ark. 469, 1 Ark. Terr. Rep. 1
3.	Click the highlighter icon, and highlight text, adding annotations. Five options exist to categorize annotations, the “correction” option is intended to correct technical mistakes (primarily OCR mistakes) found in the opinion. You also have the option of highlighting disjoint pieces of text under a single annotation (e.g. every time the plaintiff is mentioned or every reference to another case) 
4.	When you are finished, click the print icon on the top right of the screen, a PDF document will be generated with your annotations as footnotes. 

## **Approach:**

*This section outlines, in general terms, the main changes made the Litterae and where they can be found. All code is available on GitHub: https://github.com/rmahari/litterae*

Summary: LITTERAE was designed to allow users to annotate Latin texts and interact with instructors through the app. Litterae for Law builds on this by extracting the majority opinion and header information (case title, court, date and reporter) and displaying this for the user to annotate. I changed the options a user has to annotate (filters) and added a search bar that allows a user to query the Caselaw Access Project database through its API. Users can generate a PDF document of the opinion which includes their annotations as footnotes.

Below, the changes made are broken down, in general terms, into individual files to make it easier for others to follow or modify my approach.

### app.htm 
*	The options users have to categorize annotations were changed, this involved creating new filters and adding these filters to the annotation form (where users add annotations) and the annotation list (where all annotations a user has added to a given case are stored).
*	A search bar was added to would allow a user to pull data from the CAP API.
*	A case header was added to display the title, court, date and reporter of the case the user searches.

### capai.js and app.js
*	When a user enters a reporter citation, the corresponding case is returned by the CAP API as a JSON object. The majority opinion and case header information are pulled out to be displayed to the user.
*	Each word in the majority opinion receives a unique ID to make annotation possible. In addition, line breaks are added to make the case more readable.

### views.js 
*	The case header and majority opinion are generated from the information provided by the API and updated it when a new case is searched for.

### app.css
*	Basic CSS styling was added for the new features


## **Possible Future Work:**

*There are many directions in which this work could be taken, here are just some suggestions.* 

*	To really make Litterae for Law useful, the cases that users annotate should be saved in a database. Individual annotations should be collected, so that eventually each case will have a large set of annotations from different authors. Authors should have a unique ID that allows annotations from individual authors to be isolated (so that a law school student can just see her own ID, a professor could see all annotations for her course, or a researcher could see all the annotations made by her research assistants etc.)
*	A separate application could be built to allow users to work with the data in Litterae for Law. Ideally, this would take an intuitive form (similar to Scratch or Blockly) that would allow users to quickly begin applying machine learning tools to the Litterae for Law dataset – this is an ambitious endeavor! Possible projects include:
  * Identify the holding in cases
  * Identify whether a case has been overturned or distinguished
  * Classify cases by type (Administrative Law, Antitrust Law, Bankruptcy Law, Business & Corporate Law and so on)
*	Users could be able to search for cases not just by citation but also by name, jurisdiction etc.
*	Other information supplied by the API, like head notes and dissents could be displayed to the user
*	Annotations could be used to generate headnotes, summaries and so on, either directly (asking people to summarize the opinion) or through machine learning – ideally both and the two approaches could be compared
*	All citations could be identified and hyperlinked
*	A “shepardizer” can be added to Litterae for Law to allow users see how the opinion evolves in subsequent law
*	As with the original LITTERAE application, instructors can have a log-in that allows them to assign cases, read student’s annotations, add their own annotations etc. Annotations could include multimedia files like videos of classroom discussions, papers etc. Litterae for Law can be linked to H2O, a platform developed by the Harvard Berman Klein Center to develop, remix, and share online textbooks and casebooks under a Creative Commons license.
*	Users with an API key could enter it to gain access to all cases in the Caselaw Access Project (currently, only Illinois and Arkansas are available publicly) and agree to share all cases they annotate (up to 500 per day) under the CAP agreement.
*	Information beyond CAP could be added to Litterae for Law such as:
Non-US jurisdictions’ common law
  * US and international statues
  *	PACER data


	

