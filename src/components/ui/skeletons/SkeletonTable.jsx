const { Skeleton } = require("./Skeleton");

export const TableSkeleton = ({ columns, hasActions }) => (
  <>
    {[...Array(5)].map((_, rowIndex) => (
      <tr key={rowIndex} className="border-b">
        {columns.map((_, colIndex) => (
          <td key={colIndex} className="p-4">
            <Skeleton className="h-4 w-3/4" />
          </td>
        ))}
        {hasActions && (
          <td className="p-4">
            <Skeleton className="h-8 w-20" />
          </td>
        )}
      </tr>
    ))}
  </>
);