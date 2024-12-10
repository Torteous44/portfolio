import React from 'react';

const DateAsciiArt = () => {
  const today = new Date();
  const formattedDate = today.toDateString(); // e.g., "Mon Dec 10 2024"

  return (
    <pre
      style={{
        fontFamily: 'monospace',
        textAlign: 'center',
        margin: '20px 0',
        fontSize: '1.2em',
        whiteSpace: 'pre',
      }}
    >
      {`                                               ____
                      ( )_ ____                ___.--'   '--(  )
                     //      \\      __.------'              ||
                    //        '----'                        ||
                   //                                       ||
                  //      Today is ${formattedDate}         ||
                 //         Have a great day!               ||
   ,,,,,        //                                  ,,,,,   ||
  ;;;;;\\      ,/(_/                               ;;;;;\\   ||
  ';;C '\\   .'//     ____                    /--'-'';;C '\\-\\|-:
   );  _) .' //\\____'    '----.____.--'\\----'       );  _)  / :
 .'=. (  '/|//                                    .'=. (   / /
|   )'-\\.' __/                                    |   )'-\\/ /|
\\   \\ ,'\\///                                      \\   \\ /  /||
 ;.  '  ///                                        ;.  '  / ||
  | '._,'//                                         | '._,'|-||:
   \\    //                                          \\      )-||:
  )===//]                                           )=====] ||
 /   // \\                                          /       \\||
 \\_ (/   |                                         \\_      )||
  \\      |\\                                        \\\\      |
  \\      | \\                                        \\\\     |
  |      |  )                                       ||     /
  |     /  /                                        ||    |
   \\    | /                                         \\\\    |
   |    |/                                          ||    |
  /|    |                                           ||    |
 /\\|    |                                           ||    |
/'.|    |                                           ||    |
'=.[____)                                           |[___/
       ) ''--.                                          ))  ''--.
       '='===='                                          ''='===='


      `}


    </pre>
  );
};

export default DateAsciiArt;
