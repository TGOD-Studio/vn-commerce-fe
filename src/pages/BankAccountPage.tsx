import Header from "../component/Header";
import { Button, Center, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Swal from "sweetalert2";
import axios from "../services/api";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { getToken } from "../utils/helpers";
import { useEffect } from "react";
import { setUser } from "../features/user/userSlice";

const BankAccountPage = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      bankName: "",
      accountNumber: "",
      accountHolder: "",
    },
  });

  const handleOnFormSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: "error",
        text: "không tìm thấy người dùng",
        confirmButtonColor: "#6EE3A5",
      });
      return;
    }

    try {
      const token = getToken();
      const { bankName, accountNumber, accountHolder } = form.getValues();

      await axios.put(
        `/users/${user.id}`,
        { bankName, accountNumber, accountHolder, point: user.point },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        setUser({
          id: user.id,
          phone: user.phone,
          point: user.point,
          role: user.role,
          bankName,
          accountNumber,
          accountHolder,
          canUpdatePassword: user.canUpdatePassword,
          canUpdateBankName: user.canUpdateBankName,
          canUpdateAccountNumber: user.canUpdateAccountNumber,
          canUpdateAccountHolder: user.canUpdateAccountHolder
        })
      );

      Swal.fire({
        icon: "success",
        text: "Thông tin ngân hàng đã được cập nhật thành công",
        confirmButtonColor: "#6EE3A5",
        timer: 2000,
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        text: "Cập nhật nhầm thông tin ngân hàng",
        confirmButtonColor: "#6EE3A5",
      });
    }
  };

  useEffect(() => {
    if (user) {
      form.setValues({
        bankName: user.bankName,
        accountNumber: user.accountNumber,
        accountHolder: user.accountHolder,
      });
    }
  }, [user]);

  return (
    <>
      <Header title="Thêm tài khoản ngân hàng" />
      <Stack gap="16px" style={{ padding: "16px 24px 0px 24px" }}>
        <TextInput
          disabled={!user?.canUpdateBankName}
          // description={!user?.canUpdateBankName ? "Bạn đã được quản trị viên chỉnh sửa và không thể chỉnh sửa chúng. Vui lòng liên hệ với bộ phận dịch vụ.": ""}
          label="Tên ngân hàng"
          placeholder="Nhập tên ngân hàng"
          key={form.key("bankName")}
          {...form.getInputProps("bankName")}
        />
        <TextInput
          disabled={!user?.canUpdateAccountNumber}
          // description={!user?.canUpdateAccountNumber ? "Bạn đã được quản trị viên chỉnh sửa và không thể chỉnh sửa chúng. Vui lòng liên hệ với bộ phận dịch vụ.": ""}
          label="Số tài khoản"
          placeholder="Nhập số tài khoản"
          key={form.key("accountNumber")}
          {...form.getInputProps("accountNumber")}
        />
        <TextInput
          disabled={!user?.canUpdateAccountHolder}
          // description={!user?.canUpdateAccountHolder ? "Bạn đã được quản trị viên chỉnh sửa và không thể chỉnh sửa chúng. Vui lòng liên hệ với bộ phận dịch vụ.": ""}
          label="Chủ tài khoản"
          placeholder="Nhập họ tên người nhận"
          key={form.key("accountHolder")}
          {...form.getInputProps("accountHolder")}
        />
        <Center>
          <Button
            disabled={
              !user?.canUpdateBankName &&
              !user?.canUpdateAccountNumber &&
              !user?.canUpdateAccountHolder
            }
            onClick={(e) => handleOnFormSubmit(e)}
            variant="gradient"
            style={{ paddingLeft: "25px", paddingRight: "25px" }}
            gradient={{
              from: "teal",
              to: "rgba(240, 240, 240, 1)",
              deg: 180,
            }}
          >
            Xác nhận
          </Button>
        </Center>
      </Stack>
    </>
  );
};

export default BankAccountPage;
