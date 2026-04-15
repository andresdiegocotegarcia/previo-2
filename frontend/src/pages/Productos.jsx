import { useState, useEffect } from "react";
import api from "../services/api";
import "./Productos.css";

function Productos({ onLogout }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    subcategoria: "",
    precio: "",
    precioxcantidad: "",
    estado: "activo"
  });

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/productos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProductos(res.data.data);
    } catch (err) {
      console.error("Error fetching productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = {
        ...formData,
        precio: parseFloat(formData.precio),
        precioxcantidad: parseFloat(formData.precioxcantidad)
      };

      if (editingId) {
        const id = parseInt(editingId);
        await api.put(`/productos/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post("/productos", data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      resetForm();
      fetchProductos();
    } catch {
      alert("Error al guardar producto");
    }
  };

  const handleEdit = (producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      subcategoria: producto.subcategoria,
      precio: producto.precio,
      precioxcantidad: producto.precioxcantidad,
      estado: producto.estado
    });
    setEditingId(producto.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/productos/${parseInt(id)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProductos();
    } catch {
      alert("Error al eliminar producto");
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      subcategoria: "",
      precio: "",
      precioxcantidad: "",
      estado: "activo"
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="productos-container">
      <div className="productos-header">
        <h2>Gestión de Productos</h2>
        <div className="header-actions">
          <button className="add-button" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancelar" : "+ Agregar Producto"}
          </button>
          <button className="logout-button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Editar Producto" : "Nuevo Producto"}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input
                name="nombre"
                placeholder="Nombre del producto"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Subcategoría</label>
              <input
                name="subcategoria"
                placeholder="Subcategoría"
                value={formData.subcategoria}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group form-group-full">
              <label>Descripción</label>
              <input
                name="descripcion"
                placeholder="Descripción del producto"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input
                name="precio"
                type="number"
                placeholder="Precio"
                value={formData.precio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Precio por cantidad</label>
              <input
                name="precioxcantidad"
                type="number"
                placeholder="Precio por cantidad"
                value={formData.precioxcantidad}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {editingId ? "Actualizar" : "Guardar"}
            </button>
            <button type="button" className="cancel-button" onClick={resetForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {productos.length === 0 ? (
        <div className="empty-state">
          No hay productos disponibles
        </div>
      ) : (
        <div className="product-list">
          {productos.map(producto => (
            <div key={producto.id} className="product-card">
              <div className="product-info">
                <h3>{producto.nombre}</h3>
                <div className="product-details">
                  <span className="product-detail">
                    <strong>Descripción:</strong> {producto.descripcion}
                  </span>
                  <span className="product-detail">
                    <strong>Subcategoría:</strong> {producto.subcategoria}
                  </span>
                  <span className="product-detail">
                    <strong>Precio:</strong> ${producto.precio}
                  </span>
                  <span className="product-detail">
                    <strong>Precio x cantidad:</strong> ${producto.precioxcantidad}
                  </span>
                  <span className={`status-badge ${producto.estado}`}>
                    {producto.estado}
                  </span>
                </div>
              </div>
              <div className="product-actions">
                <button className="edit-button" onClick={() => handleEdit(producto)}>
                  Editar
                </button>
                <button className="delete-button" onClick={() => handleDelete(producto.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Productos;
