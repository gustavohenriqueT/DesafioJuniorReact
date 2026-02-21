import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useEmails } from "../hooks/useEmails";
import {
  type ChangePasswordFormData,
  type CreateEmailFormData,
  changePasswordSchema,
  createEmailSchema,
} from "../schemas/email";
import { emailService } from "../services/emailService";

export const DomainDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const { data: emails, isLoading, isError } = useEmails(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEmailFormData>({
    resolver: zodResolver(createEmailSchema),
    defaultValues: { storage: 1024 },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateEmailFormData) =>
      emailService.createEmail(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", id] });
      toast.success("Conta criada com sucesso!");
      closeModal();
    },
    onError: () => toast.error("Erro ao criar a conta."),
  });

  const deleteMutation = useMutation({
    mutationFn: (emailId: string) => emailService.deleteEmail(id!, emailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", id] });
      toast.success("Conta removida com sucesso!");
    },
    onError: () => toast.error("Erro ao excluir a conta."),
  });

  const toggleBlockMutation = useMutation({
    mutationFn: (emailId: string) =>
      emailService.toggleBlockStatus(id!, emailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", id] });
      toast.success("Status atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar status."),
  });

  const updateStorageMutation = useMutation({
    mutationFn: ({ emailId, storage }: { emailId: string; storage: number }) =>
      emailService.updateStorage(id!, emailId, storage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", id] });
      toast.success("Armazenamento atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar armazenamento."),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      emailService.updatePassword(id!, selectedEmailId!, data),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      closePasswordModal();
    },
    onError: () => toast.error("Erro ao alterar senha."),
  });

  const onSubmit = (data: CreateEmailFormData) => createMutation.mutate(data);
  const onPasswordSubmit = (data: ChangePasswordFormData) =>
    changePasswordMutation.mutate(data);

  const handleDelete = (emailId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta conta?")) {
      deleteMutation.mutate(emailId);
    }
  };

  const handleUpdateStorage = (emailId: string, currentStorage: number) => {
    const newStorageStr = window.prompt(
      "Novo limite (MB):",
      currentStorage.toString(),
    );
    if (newStorageStr !== null) {
      const newStorage = Number(newStorageStr);
      if (!isNaN(newStorage) && newStorage > 0) {
        updateStorageMutation.mutate({ emailId, storage: newStorage });
      } else {
        toast.error("Insira um valor válido maior que zero.");
      }
    }
  };

  const openPasswordModal = (emailId: string) => {
    setSelectedEmailId(emailId);
    setIsPasswordModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    passwordForm.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate("/domains")}
              className="text-sm text-gray-500 hover:text-blue-600 mb-2 flex items-center transition-colors"
            >
              ← Voltar para Domínios
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Contas de E-mail
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            + Nova Conta
          </button>
        </div>

        {isLoading && (
          <div className="animate-pulse h-32 bg-gray-200 rounded-lg w-full mb-4"></div>
        )}
        {isError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 border border-red-100">
            Erro ao carregar contas.
          </div>
        )}

        {!isLoading && !isError && emails && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {emails.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                Nenhuma conta encontrada para este domínio.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {emails.map((account) => (
                  <div
                    key={account.id}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {account.email}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${account.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                        >
                          {account.isBlocked ? "Bloqueado" : "Ativo"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Storage: {account.storage} MB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdateStorage(account.id, account.storage)
                        }
                        className="px-3 py-1.5 text-sm border rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Armazenamento
                      </button>
                      <button
                        onClick={() => openPasswordModal(account.id)}
                        className="px-3 py-1.5 text-sm border rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Senha
                      </button>
                      <button
                        onClick={() => toggleBlockMutation.mutate(account.id)}
                        className={`px-3 py-1.5 text-sm border rounded-md font-medium transition-colors ${account.isBlocked ? "text-green-700 border-green-200 hover:bg-green-50" : "text-orange-700 border-orange-200 hover:bg-orange-50"}`}
                      >
                        {account.isBlocked ? "Desbloquear" : "Bloquear"}
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="px-3 py-1.5 text-sm border border-red-200 rounded-md text-red-700 hover:bg-red-50 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Criar Conta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Criar Nova Conta
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage (MB)
                </label>
                <input
                  type="number"
                  {...register("storage")}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.storage && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.storage.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? "Criando..." : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Alterar Senha */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Alterar Senha
            </h2>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  {...passwordForm.register("password")}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Mínimo 6 caracteres"
                />
                {passwordForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {changePasswordMutation.isPending
                    ? "Salvando..."
                    : "Salvar Nova Senha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};