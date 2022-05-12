import React, { useState } from 'react';
import DataTable from 'react-data-table-component'; //Consulted (2022-05) in: https://react-data-table-component.netlify.app/?path=/docs/getting-started-examples--page
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export class QuestionsComponent extends React.Component { // Consulted (2022-05) in: https://es.stackoverflow.com/questions/219713/como-consumir-una-api-con-reactjs
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false
    };
  }

  handleSubmit = (event) => { // Consulted (2022-05) in: https://stackoverflow.com/questions/23427384/get-form-data-in-reactjs
    event.preventDefault();
    // console.log(event.target.elements.question.value); // from elements property
    // console.log(event.target.question.value); // or directly

    const requestOptions = { // Consulted (2022-05) in: https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_number: event.target.elements.question_number.value,
        question: event.target.elements.question.value,
        answers: [
          { answer: event.target.elements.answer_1.value },
          { answer: event.target.elements.answer_2.value },
          { answer: event.target.elements.answer_3.value },
          { answer: event.target.elements.answer_4.value },
        ]
      })
    };

    fetch('v1/create-questionnaire', requestOptions)
      .then(res => res.json())
      .then(
        () => {
          fetch('v1/list-questionnaire')
            .then(resp => resp.json())
            .then(
              (result) => {
                // console.log(result);
                this.setState({
                  isLoaded: true,
                  resp: result.data
                });
              },
              // Nota: es importante manejar errores aquí y no en
              // un bloque catch() para que no interceptemos errores
              // de errores reales en los componentes.
              (err) => {
                this.setState({
                  isLoaded: true,
                  err
                });
              }
            );
        },
        // Nota: es importante manejar errores aquí y no en
        // un bloque catch() para que no interceptemos errores
        // de errores reales en los componentes.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  handleDeleteQuestion(id) {
    const requestOptions = { // Consulted (2022-05) in: https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };

    fetch('http://localhost:3001/v1/delete-questionnaire/' + id, requestOptions)
      .then(res => res.json())
      .then(
        () => {
          fetch('http://localhost:3001/v1/list-questionnaire')
            .then(resp => resp.json())
            .then(
              (result) => {
                // console.log(result);
                this.setState({
                  isLoaded: true,
                  resp: result.data
                });
              },
              // Nota: es importante manejar errores aquí y no en
              // un bloque catch() para que no interceptemos errores
              // de errores reales en los componentes.
              (error) => {
                this.setState({
                  isLoaded: true,
                  error
                });
              }
            );
        },
        // Nota: es importante manejar errores aquí y no en
        // un bloque catch() para que no interceptemos errores
        // de errores reales en los componentes.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  componentDidMount() { // Consulted (2022-05) in: https://es.reactjs.org/docs/faq-ajax.html
    fetch('v1/list-questionnaire')
      .then(res => res.json())
      .then(
        (result) => {
          // console.log(result);
          this.setState({
            isLoaded: true,
            resp: result.data
          });
        },
        // Nota: es importante manejar errores aquí y no en
        // un bloque catch() para que no interceptemos errores
        // de errores reales en los componentes.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    const { error, isLoaded, resp } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      const customStyles = {
        rows: {
          style: {
            minWidth: '200vh', // override the row width
          },
        },
      };

      const columns = [
        {
          name: 'Question Number',
          selector: row => row.question_number,
          sortable: true,
        },
        {
          name: 'Question',
          selector: row => row.question,
          sortable: true,
        },
        {
          name: 'Answers',
          selector: row => row.answers,
        },
        {
          name: 'Action',
          selector: row => row.action,
        },
      ];

      const data = resp.map(resp => (
        {
          id: resp._id,
          question_number: resp.question_number,
          question: resp.question,
          answers: resp.answers.map(answer => (
            answer.answer
          )).join(', '),
          action: <button onClick={() => this.handleDeleteQuestion(resp._id)}>Delete Question</button>
        }
      ));
      // console.log(data);

      // return (
      //   <ul>
      //     {data.map(data => (
      //       <li key={data._id}>
      //         {data.question_number}.- {data.question}
      //         {data.answers.map((answer, index) => (
      //           <p key={index}>
      //             {answer.answer}
      //           </p>
      //         ))}
      //       </li>
      //     ))}
      //   </ul>
      // );

      const this_function = this;

      function AddQuestionnaireModal() { //Consulted (2022-05) in: https://react-bootstrap.github.io/components/modal/
        const [show, setShow] = useState(false);

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        return (
          <div>
            <Button variant="primary" onClick={handleShow}>
              Add Questionnaire
            </Button>

            <Modal show={show} onHide={handleClose}>
              <form onSubmit={this_function.handleSubmit}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Questionnaire</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row">
                    <div className="col-4">Question number</div>
                    <div className="col-8"><input type="number" id="question_number" name="question_number" required /></div>
                  </div>
                  <div className="row">
                    <div className="col-4">Question</div>
                    <div className="col-8"><input type="text" id="question" name="question" required /></div>
                  </div>
                  <div className="row">
                    <div className="col-4">Answer 1</div>
                    <div className="col-8"><input type="text" id="answer_1" name="answer_1" required /></div>
                  </div>
                  <div className="row">
                    <div className="col-4">Answer 2</div>
                    <div className="col-8"><input type="text" id="answer_2" name="answer_2" required /></div>
                  </div>
                  <div className="row">
                    <div className="col-4">Answer 3</div>
                    <div className="col-8"><input type="text" id="answer_3" name="answer_3" required /></div>
                  </div>
                  <div className="row">
                    <div className="col-4">Answer 4</div>
                    <div className="col-8"><input type="text" id="answer_4" name="answer_4" required /></div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    Save
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>
          </div>
        );
      }

      return (
        <div>
          <AddQuestionnaireModal />
          <br/>
          <DataTable
            title="Questionnarie List"
            customStyles={customStyles}
            columns={columns}
            data={data}
            pagination
          />
          <br/>
        </div>
      );
    }
  }
}
