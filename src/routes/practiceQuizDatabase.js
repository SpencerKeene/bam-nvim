import pquizq1 from '../assets/pQuizPics/pQuizQ1.png';
import pquizq2 from '../assets/pQuizPics/pQuizQ2.png';
import pquizq3 from '../assets/pQuizPics/pQuizQ3.png';

import pquizq1a1 from '../assets/pQuizPics/pQuizQ1A1.png';
import pquizq1a2 from '../assets/pQuizPics/pQuizQ1A2.png';
import pquizq1a3 from '../assets/pQuizPics/pQuizQ1A3.png';
import pquizq1a4 from '../assets/pQuizPics/pQuizQ1A4.png';
import pquizq2a1 from '../assets/pQuizPics/pQuizQ2A1.png';
import pquizq2a2 from '../assets/pQuizPics/pQuizQ2A2.png';
import pquizq2a3 from '../assets/pQuizPics/pQuizQ2A3.png';
import pquizq2a4 from '../assets/pQuizPics/pQuizQ2A4.png';
import pquizq3a1 from '../assets/pQuizPics/pQuizQ3A1.png';
import pquizq3a2 from '../assets/pQuizPics/pQuizQ3A2.png';
import pquizq3a3 from '../assets/pQuizPics/pQuizQ3A3.png';
import pquizq3a4 from '../assets/pQuizPics/pQuizQ3A4.png';

const pquizqas = {
    pquizq1a1,
    pquizq1a2,
    pquizq1a3,
    pquizq1a4,
    pquizq2a1,
    pquizq2a2,
    pquizq2a3,
    pquizq2a4,
    pquizq3a1,
    pquizq3a2,
    pquizq3a3,
    pquizq3a4
}

const pquizqs = {
    pquizq1,
    pquizq2,
    pquizq3
}

const pqArray = [
    {
        question: pquizq1,
        answers:[
         {ansImg: pquizq1a1, isCorrect: false},
         {ansImg: pquizq1a2, isCorrect: false},
         {ansImg: pquizq1a3, isCorrect: true},
         {ansImg: pquizq1a4, isCorrect: false}]
	  }, {
        question: pquizq2,
        answers:[
         {ansImg: pquizq2a1, isCorrect: false},
         {ansImg: pquizq2a2, isCorrect: true},
         {ansImg: pquizq2a3, isCorrect: false},
         {ansImg: pquizq2a4, isCorrect: false}]
	  }, {
        question: pquizq3,
        answers:[
         {ansImg: pquizq3a1, isCorrect: true},
         {ansImg: pquizq3a2, isCorrect: false},
         {ansImg: pquizq3a3, isCorrect: false},
         {ansImg: pquizq3a4, isCorrect: false}]
	  }
    ]

    export default pqArray;