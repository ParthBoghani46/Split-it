const GroupPage = ({
  params: { groupId },
}: {
  params: { groupId: string };
}): JSX.Element => {
  window.location.href = `/groups/${groupId}/expenses`;
  return <></>;
};
export default GroupPage;
