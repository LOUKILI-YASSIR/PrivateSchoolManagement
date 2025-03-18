const UseForm = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    
    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };
    
    return {
        form,
        handleChange,
    };
    }