function NameList() {
    let names = ['太郎', '花子', '次郎'];
  
    return (
      <ul>
        {names.map((name, index) =>
          <li key={index}>{name}</li>
        )}
      </ul>
    );
  }

  export default NameList