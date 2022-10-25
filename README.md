# foodify
<p>Welcome to foodify!<br>
   To get started, check out our docs/ folder and review our documentation.<br>
   Already familiar with the project? Clone this repo and check it out!</p>

# Package information
  As a web application, this project is divided between two fundamental packages, 
  the client and server packages (roughly corresponding to frontend and backend
  respectively). client/ contains html scripts, cascading style sheets, and javascript
  files used client-side, whereas server/ contains nodejs files for controlling
  and processing data backend.
  
# Extra readme info
## Sprint: 1  Author: Praise Chinedu-Eneh

### Purpose: 

In this sprint, I will define the backend functions needed to 
create an account, and view the menu. 

#### View Menu (Manager POV)
"""When the backend recieves a get request from the front end, we will look 
at the request body. We are expecting the data coming from the frontend 
to be JSON data in the form: {username: "admin", password: "admin"}. If 
the params match this format with the correct values, we will send back 
JSON data of the Menu.""" The Menu object will be in the form specified at 
the bottom of the USE CASE document. We will also use the username and 
password to check the authority level of the staff member. If they are a 
manager, we will send back a flag saying so, and the frontend would 
respond by displaying the appropriate button layout and view options for 
their security clearence level.

#### Create a new employee account
When the create account button is clicked, the backend would recieve a 
post request with the new employees information. We would parse that 
information and add it to the database.
